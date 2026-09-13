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
      .select('*, item:items(*)')
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
 * - decor: multiple can be equipped simultaneously.
 * - companion: only 1 companion can be equipped at once. Equipping a new one auto-unequips the previous.
 * - badge: multiple can be equipped simultaneously.
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
      .select('*, item:items(*)')
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

    // 2. Companion exclusivity rule: If equipping a companion, auto-unequip other companions
    if (targetEquipped && category === 'companion') {
      // Find other owned items that are companions
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
          .update({ equipped: false })
          .eq('id', comp.id)
          .eq('user_id', userId);
      }
    }

    // 3. Update the target item's equipped status
    const { data: updatedEntry, error: updateErr } = await client
      .from('inventory')
      .update({ equipped: targetEquipped })
      .eq('id', inventoryId)
      .eq('user_id', userId)
      .select('*, item:items(*)')
      .single();

    if (updateErr) throw updateErr;

    return res.status(200).json({
      message: targetEquipped 
        ? `Equipped ${currentEntry.item?.name || 'item'}!` 
        : `Unequipped ${currentEntry.item?.name || 'item'}.`,
      inventory: updatedEntry,
      equipped: targetEquipped
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
