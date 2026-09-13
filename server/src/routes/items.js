import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin, supabase } from '../supabase.js';
import { checkAchievements } from '../utils/achievements.js';

const router = express.Router();
const getClient = () => supabaseAdmin || supabase;

/**
 * GET /api/items
 * Public: List catalog items sorted by cost
 */
router.get('/', async (req, res) => {
  try {
    const { data: items, error } = await getClient()
      .from('items')
      .select('*')
      .order('cost', { ascending: true });

    if (error) throw error;

    return res.status(200).json({
      items: items || []
    });
  } catch (err) {
    console.error('[Get Items Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

/**
 * POST /api/items/:id/purchase
 * Protected: Purchase an item from the catalog
 * Verifies cozy_coins, deducts cost, inserts into inventory
 */
router.post('/:id/purchase', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;
    const client = getClient();

    // 1. Fetch item from catalog
    const { data: item, error: itemErr } = await client
      .from('items')
      .select('*')
      .eq('id', itemId)
      .maybeSingle();

    if (itemErr) throw itemErr;

    if (!item) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Item not found in the shop catalog.'
      });
    }

    // 2. Fetch user's character for current coin balance
    const { data: character, error: charErr } = await client
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (charErr || !character) {
      return res.status(500).json({
        error: 'Character Error',
        message: 'Could not load your character profile.'
      });
    }

    const currentCoins = character.cozy_coins || 0;
    const itemCost = item.cost || 0;

    // Reject with 400 if insufficient funds
    if (currentCoins < itemCost) {
      return res.status(400).json({
        error: 'Insufficient Funds',
        message: `You need ${itemCost} Cozy Coins to purchase ${item.name}, but you only have ${currentCoins} Cozy Coins. Complete more quests to earn coins!`,
        required: itemCost,
        current: currentCoins
      });
    }

    // 3. Deduct coins and insert into inventory
    const newCoinBalance = currentCoins - itemCost;

    const { data: updatedChar, error: updateCharErr } = await client
      .from('characters')
      .update({ cozy_coins: newCoinBalance })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateCharErr) throw updateCharErr;

    // Insert into inventory
    const { data: inventoryEntry, error: invErr } = await client
      .from('inventory')
      .insert({
        user_id: userId,
        item_id: itemId,
        equipped: false
      })
      .select('*, item:items(*)')
      .single();

    if (invErr) throw invErr;

    // Check & award achievements (non-blocking)
    const newAchievements = await checkAchievements(userId, client);

    return res.status(200).json({
      message: `Successfully purchased ${item.name}!`,
      item,
      inventory: inventoryEntry,
      character: updatedChar,
      newAchievements
    });

  } catch (err) {
    console.error('[Purchase Item Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

export default router;
