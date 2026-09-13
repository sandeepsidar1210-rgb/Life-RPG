import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin, supabase } from '../supabase.js';

const router = express.Router();
const getClient = () => supabaseAdmin || supabase;

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

    return res.status(200).json({
      inventory: inventory || []
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

    // 4. Update the target item's equipped status and room_id
    const updatePayload = targetEquipped
      ? { equipped: true, room_id: targetRoomId }
      : { equipped: false, room_id: null };

    const { data: updatedEntry, error: updateErr } = await client
      .from('inventory')
      .update(updatePayload)
      .eq('id', inventoryId)
      .eq('user_id', userId)
      .select('*, item:items(*), room:rooms(*)')
      .single();

    if (updateErr) throw updateErr;

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

export default router;
