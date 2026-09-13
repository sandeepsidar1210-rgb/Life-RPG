import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin, supabase } from '../supabase.js';

const router = express.Router();

/**
 * GET /api/me
 * Protected route: fetches current user profile, character stats, and streaks
 * Strictly uses req.user.id from the verified JWT
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const client = supabaseAdmin || supabase;

    // 1. Fetch character
    let { data: character, error: charError } = await client
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (charError) throw charError;

    // Fallback: If trigger hasn't fired yet or row missing, provision default character
    if (!character) {
      const { data: newChar, error: insertCharError } = await client
        .from('characters')
        .insert({
          user_id: userId,
          level: 1,
          current_xp: 0,
          xp_to_next_level: 100,
          cozy_coins: 50,
          focus: 1,
          discipline: 1,
          vitality: 1,
          creativity: 1
        })
        .select()
        .single();

      if (insertCharError) throw insertCharError;
      character = newChar;
    }

    // 2. Fetch streak
    let { data: streak, error: streakError } = await client
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (streakError) throw streakError;

    if (!streak) {
      const { data: newStreak, error: insertStreakError } = await client
        .from('streaks')
        .insert({
          user_id: userId,
          current_streak: 0,
          longest_streak: 0
        })
        .select()
        .single();

      if (insertStreakError) throw insertStreakError;
      streak = newStreak;
    }

    // 3. Fetch user's inventory
    const { data: inventory, error: invError } = await client
      .from('inventory')
      .select('*, item:items(*)')
      .eq('user_id', userId);

    if (invError) throw invError;

    // 4. Fetch user's bound study spirit
    let spirit = null;
    try {
      const { data: userSpirit } = await client
        .from('user_spirits')
        .select('*, species:spirit_species(*)')
        .eq('user_id', userId)
        .maybeSingle();
      spirit = userSpirit;
    } catch (_) {}

    return res.status(200).json({
      user: {
        id: req.user.id,
        email: req.user.email
      },
      character,
      streak,
      inventory: inventory || [],
      spirit
    });

  } catch (err) {
    console.error('[Error fetching profile]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

export default router;
