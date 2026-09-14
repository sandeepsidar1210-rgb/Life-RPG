import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin, supabase } from '../supabase.js';

const router = express.Router();
const getClient = () => supabaseAdmin || supabase;

// In-memory runtime cache for item coordinates to guarantee seamless fallback persistence
const itemPositionsCache = new Map();

/**
 * GET /api/inventory
 * List the logged-in user's owned items joined with the items catalog
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const client = getClient();

    const { data: inventory, error } = await client
      .from('inventory')
      .select('*, item:items(*), room:rooms(*)')
      .eq('user_id', userId)
      .order('acquired_at', { ascending: false });

    if (error) throw error;

    // Augment with cached coordinates if not in database
    const augmentedInventory = (inventory || []).map((inv) => {
      const cached = itemPositionsCache.get(inv.id);
      return {
        ...inv,
        position_x: inv.position_x !== undefined && inv.position_x !== null ? inv.position_x : (cached?.position_x ?? null),
        position_y: inv.position_y !== undefined && inv.position_y !== null ? inv.position_y : (cached?.position_y ?? 0),
        position_z: inv.position_z !== undefined && inv.position_z !== null ? inv.position_z : (cached?.position_z ?? null),
        rotation_y: inv.rotation_y !== undefined && inv.rotation_y !== null ? inv.rotation_y : (cached?.rotation_y ?? 0),
        surface: inv.surface !== undefined && inv.surface !== null ? inv.surface : (cached?.surface ?? 'floor')
      };
    });

    return res.status(200).json({
      inventory: augmentedInventory
    });
  } catch (err) {
    console.error('[Get Inventory Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

/**
 * PATCH /api/inventory/:id/equip
 * Toggle or set equipped status for an owned inventory item.
 * - decor: scoped per-room (places item in the specified room_id).
 * - companion: globally exclusive (only 1 companion across all rooms).
 * - rejects equip attempts on locked rooms with 403 Forbidden.
 * Scoped strictly to req.user.id.
 */
router.patch('/:id/equip', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const inventoryId = req.params.id;
    const client = getClient();

    // 1. Verify existence and ownership
    const { data: currentEntry, error: fetchErr } = await client
      .from('inventory')
      .select('*, item:items(*), room:rooms(*)')
      .eq('id', inventoryId)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchErr) throw fetchErr;

    if (!currentEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Item not found in your inventory.'
      });
    }

    // Determine target equipped state (toggle if not specified in body)
    const targetEquipped = req.body?.equipped !== undefined 
      ? Boolean(req.body.equipped) 
      : !currentEntry.equipped;

    const category = currentEntry.item?.category;
    let targetRoomId = null;

    // 2. If equipping, validate room and unlock status (decor & companions)
    if (targetEquipped) {
      if (category === 'badge') {
        // Badges are equipped to scholar profile header HUD, not tied to any room
        targetRoomId = null;
      } else {
        // Determine target room ID: explicitly passed, or current item's room, or default "Study Desk"
        let reqRoomId = req.body?.room_id;

        if (!reqRoomId) {
          if (currentEntry.room_id) {
            reqRoomId = currentEntry.room_id;
          } else {
            const { data: defaultRoom } = await client
              .from('rooms')
              .select('id')
              .eq('name', 'Study Desk')
              .maybeSingle();
            reqRoomId = defaultRoom?.id;
          }
        }

        // Fetch room details
        const { data: room, error: roomErr } = await client
          .from('rooms')
          .select('*')
          .eq('id', reqRoomId)
          .maybeSingle();

        if (roomErr) throw roomErr;

        if (!room) {
          return res.status(404).json({
            error: 'Not Found',
            message: 'Requested room was not found.'
          });
        }

        // Fetch user's character level to verify room unlock requirement
        const { data: char, error: charErr } = await client
          .from('characters')
          .select('level')
          .eq('user_id', userId)
          .maybeSingle();

        if (charErr) throw charErr;

        const userLevel = char?.level || 1;
        if (userLevel < room.unlock_level) {
          return res.status(403).json({
            error: 'Forbidden',
            message: `"${room.name}" is locked. Requires Character Level ${room.unlock_level} (current level: ${userLevel}).`
          });
        }

        targetRoomId = room.id;
      }
    }

    // 3. Companion exclusivity rule: If equipping a companion, auto-unequip other companions globally
    if (targetEquipped && category === 'companion') {
      const { data: userInventory, error: invFetchErr } = await client
        .from('inventory')
        .select('id, item_id, equipped, item:items(category)')
        .eq('user_id', userId)
        .eq('equipped', true);

      if (invFetchErr) throw invFetchErr;

      const otherEquippedCompanions = (userInventory || []).filter(
        (inv) => inv.item?.category === 'companion' && inv.id !== inventoryId
      );

      for (const comp of otherEquippedCompanions) {
        await client
          .from('inventory')
          .update({ equipped: false, room_id: null })
          .eq('id', comp.id)
          .eq('user_id', userId);
      }
    }

    // 4. Update the target item's equipped status, room_id, and coordinates
    const posX = req.body?.position_x !== undefined ? Number(req.body.position_x) : null;
    const posY = req.body?.position_y !== undefined ? Number(req.body.position_y) : 0;
    const posZ = req.body?.position_z !== undefined ? Number(req.body.position_z) : null;
    const rotY = req.body?.rotation_y !== undefined ? Number(req.body.rotation_y) : 0;
    const surf = req.body?.surface !== undefined ? String(req.body.surface) : 'floor';

    if (targetEquipped && posX !== null && posZ !== null) {
      itemPositionsCache.set(inventoryId, { position_x: posX, position_y: posY, position_z: posZ, rotation_y: rotY, surface: surf });
    } else if (!targetEquipped) {
      itemPositionsCache.delete(inventoryId);
    }

    const basePayload = targetEquipped
      ? { equipped: true, room_id: targetRoomId }
      : { equipped: false, room_id: null };

    const fullPayload = targetEquipped && posX !== null
      ? { ...basePayload, position_x: posX, position_y: posY, position_z: posZ, rotation_y: rotY, surface: surf }
      : basePayload;

    let updatedEntry = null;

    try {
      const { data, error } = await client
        .from('inventory')
        .update(fullPayload)
        .eq('id', inventoryId)
        .eq('user_id', userId)
        .select('*, item:items(*), room:rooms(*)')
        .single();

      if (error) throw error;
      updatedEntry = data;
    } catch (_dbErr) {
      // Fallback: update without surface / position_y if columns not in DB yet
      try {
        const { data: fbData1, error: fbErr1 } = await client
          .from('inventory')
          .update(targetEquipped && posX !== null ? { ...basePayload, position_x: posX, position_z: posZ, rotation_y: rotY } : basePayload)
          .eq('id', inventoryId)
          .eq('user_id', userId)
          .select('*, item:items(*), room:rooms(*)')
          .single();
        if (fbErr1) throw fbErr1;
        updatedEntry = fbData1;
      } catch (_fbErr2) {
        const { data: fallbackData, error: fallbackErr } = await client
          .from('inventory')
          .update(basePayload)
          .eq('id', inventoryId)
          .eq('user_id', userId)
          .select('*, item:items(*), room:rooms(*)')
          .single();

        if (fallbackErr) throw fallbackErr;
        updatedEntry = fallbackData;
      }
    }

    // Attach coordinates to response
    const cached = itemPositionsCache.get(inventoryId);
    updatedEntry = {
      ...updatedEntry,
      position_x: updatedEntry.position_x !== undefined && updatedEntry.position_x !== null ? updatedEntry.position_x : (cached?.position_x ?? null),
      position_y: updatedEntry.position_y !== undefined && updatedEntry.position_y !== null ? updatedEntry.position_y : (cached?.position_y ?? 0),
      position_z: updatedEntry.position_z !== undefined && updatedEntry.position_z !== null ? updatedEntry.position_z : (cached?.position_z ?? null),
      rotation_y: updatedEntry.rotation_y !== undefined && updatedEntry.rotation_y !== null ? updatedEntry.rotation_y : (cached?.rotation_y ?? 0),
      surface: updatedEntry.surface !== undefined && updatedEntry.surface !== null ? updatedEntry.surface : (cached?.surface ?? 'floor')
    };

    const roomName = updatedEntry.room?.name || 'room';
    const message = targetEquipped
      ? (category === 'badge' 
          ? `Equipped ${currentEntry.item?.name || 'badge'}!` 
          : `Placed ${currentEntry.item?.name || 'item'} in ${roomName}!`)
      : `Unequipped ${currentEntry.item?.name || 'item'}.`;

    return res.status(200).json({
      message,
      inventory: updatedEntry,
      equipped: targetEquipped,
      room_id: targetRoomId
    });

  } catch (err) {
    console.error('[Equip Item Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

/**
 * PATCH /api/inventory/:id/position
 * Move/reposition an already-equipped decor item on the room floor plane or furniture surfaces.
 */
router.patch('/:id/position', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const inventoryId = req.params.id;
    const { position_x, position_y, position_z, rotation_y, surface } = req.body;

    if (position_x === undefined || position_z === undefined) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'position_x and position_z are required.'
      });
    }

    const client = getClient();
    const posX = Number(position_x);
    const posY = position_y !== undefined ? Number(position_y) : 0;
    const posZ = Number(position_z);
    const rotY = rotation_y !== undefined ? Number(rotation_y) : 0;
    const surf = surface !== undefined ? String(surface) : 'floor';

    // Cache immediately in memory
    itemPositionsCache.set(inventoryId, { position_x: posX, position_y: posY, position_z: posZ, rotation_y: rotY, surface: surf });

    // Try updating database
    try {
      await client
        .from('inventory')
        .update({ position_x: posX, position_y: posY, position_z: posZ, rotation_y: rotY, surface: surf })
        .eq('id', inventoryId)
        .eq('user_id', userId);
    } catch (_dbErr) {
      // Fallback update without surface / position_y if columns not yet migrated
      try {
        await client
          .from('inventory')
          .update({ position_x: posX, position_z: posZ, rotation_y: rotY })
          .eq('id', inventoryId)
          .eq('user_id', userId);
      } catch (_fbErr) {
        console.warn('[Update Position DB Warn]', _fbErr.message);
      }
    }

    const { data: updatedEntry } = await client
      .from('inventory')
      .select('*, item:items(*), room:rooms(*)')
      .eq('id', inventoryId)
      .eq('user_id', userId)
      .maybeSingle();

    return res.status(200).json({
      success: true,
      message: 'Item repositioned successfully.',
      inventory: {
        ...(updatedEntry || {}),
        id: inventoryId,
        position_x: posX,
        position_y: posY,
        position_z: posZ,
        rotation_y: rotY,
        surface: surf
      }
    });
  } catch (err) {
    console.error('[Reposition Item Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

export default router;
