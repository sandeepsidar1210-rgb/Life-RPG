import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin, supabase } from '../supabase.js';

const router = express.Router();
const getClient = () => supabaseAdmin || supabase;

/**
 * GET /api/achievements
 * Returns all achievements from the catalog, annotated with:
 *   - unlocked: boolean
 *   - unlocked_at: ISO timestamp | null
 * This gives the frontend everything it needs to render a progress grid.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const client = getClient();

    // Fetch catalog and user unlocks in parallel
    const [
      { data: catalog, error: catErr },
      { data: userAchs, error: userAchErr },
    ] = await Promise.all([
      client.from('achievements').select('*').order('criteria_type').order('criteria_value'),
      client
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', userId),
    ]);

    if (catErr) throw catErr;
    if (userAchErr) throw userAchErr;

    // Build a fast lookup map: achievement_id -> unlocked_at
    const unlockedMap = {};
    for (const ua of userAchs || []) {
      unlockedMap[ua.achievement_id] = ua.unlocked_at;
    }

    // Annotate each achievement with unlock status
    const achievements = (catalog || []).map((ach) => ({
      ...ach,
      unlocked: ach.id in unlockedMap,
      unlocked_at: unlockedMap[ach.id] ?? null,
    }));

    return res.status(200).json({ achievements });
  } catch (err) {
    console.error('[Get Achievements Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
    });
  }
});

export default router;
