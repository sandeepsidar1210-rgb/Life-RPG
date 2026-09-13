import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin, supabase } from '../supabase.js';

const router = express.Router();
const getClient = () => supabaseAdmin || supabase;

/**
 * GET /api/rooms
 * Returns all rooms with unlock status and progress for the logged-in user.
 * Auth is required to determine the user's current character level.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const client = getClient();

    // 1. Fetch user's character level
    const { data: char, error: charErr } = await client
      .from('characters')
      .select('level')
      .eq('user_id', userId)
      .maybeSingle();

    if (charErr) throw charErr;

    const userLevel = char?.level || 1;

    // 2. Fetch all rooms in display order
    const { data: rooms, error: roomsErr } = await client
      .from('rooms')
      .select('*')
      .order('display_order', { ascending: true });

    if (roomsErr) throw roomsErr;

    // 3. Annotate rooms with user-specific unlock status
    const annotatedRooms = (rooms || []).map((room) => {
      const isUnlocked = userLevel >= room.unlock_level;
      return {
        ...room,
        is_unlocked: isUnlocked,
        user_level: userLevel,
        levels_remaining: isUnlocked ? 0 : Math.max(0, room.unlock_level - userLevel)
      };
    });

    return res.status(200).json({
      rooms: annotatedRooms,
      user_level: userLevel
    });
  } catch (err) {
    console.error('[Get Rooms Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

export default router;
