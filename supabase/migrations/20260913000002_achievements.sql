-- ==============================================================================
-- Life RPG Achievements System Migration
-- Tables: achievements, user_achievements
-- RLS: achievements are public-readable; user_achievements scoped to owner
-- ==============================================================================

-- 1. ACHIEVEMENTS Table (global catalog, admin-managed)
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '🏆',
    criteria_type TEXT NOT NULL CHECK (criteria_type IN (
        'quest_count', 'streak_length', 'level', 'attribute_value', 'item_count'
    )),
    criteria_attribute TEXT, -- only used when criteria_type = 'attribute_value'
    criteria_value INTEGER NOT NULL CHECK (criteria_value > 0),
    reward_coins INTEGER NOT NULL DEFAULT 0 CHECK (reward_coins >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. USER_ACHIEVEMENTS Table (unlock records per user)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Prevent double-unlocking the same achievement
    UNIQUE(user_id, achievement_id)
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_criteria_type ON public.achievements(criteria_type);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Achievements catalog: publicly readable (like items)
DROP POLICY IF EXISTS "All users can view achievements" ON public.achievements;
CREATE POLICY "All users can view achievements"
    ON public.achievements FOR SELECT
    USING (true);

-- User achievements: only the owner can read their own records
DROP POLICY IF EXISTS "Users can select own user_achievements" ON public.user_achievements;
CREATE POLICY "Users can select own user_achievements"
    ON public.user_achievements FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own user_achievements" ON public.user_achievements;
CREATE POLICY "Users can insert own user_achievements"
    ON public.user_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- SEED DATA: 12 Cozy-Themed Achievements
-- ==============================================================================
INSERT INTO public.achievements (name, description, icon, criteria_type, criteria_attribute, criteria_value, reward_coins)
VALUES
    -- Quest count milestones
    ('First Steps',
     'Complete your very first quest and begin your scholarly journey.',
     '🌱', 'quest_count', NULL, 1, 10),

    ('Budding Scholar',
     'Complete 10 quests — you''re building a real study habit.',
     '📚', 'quest_count', NULL, 10, 25),

    ('Dedicated Scholar',
     'Complete 25 quests and prove your commitment to the ancient arts.',
     '🎓', 'quest_count', NULL, 25, 50),

    ('Sage of the Scrolls',
     'Complete 50 quests — your name is etched in the Library of Legends.',
     '📜', 'quest_count', NULL, 50, 100),

    -- Streak milestones
    ('Week of Focus',
     'Maintain a 7-day study streak — consistency is the truest form of mastery.',
     '🔥', 'streak_length', NULL, 7, 30),

    ('Unbreakable',
     'Maintain a 30-day streak — an iron will forged through daily dedication.',
     '⚡', 'streak_length', NULL, 30, 75),

    -- Level milestones
    ('Rising Star',
     'Reach character level 5 — your potential is beginning to shine.',
     '⭐', 'level', NULL, 5, 20),

    ('Sage',
     'Reach character level 15 — your wisdom fills the study sanctuary with light.',
     '🧙', 'level', NULL, 15, 60),

    -- Attribute milestones
    ('Focused Mind',
     'Grow your Focus attribute to 10 through relentless concentration quests.',
     '🎯', 'attribute_value', 'focus', 10, 35),

    ('Disciplined Spirit',
     'Grow your Discipline attribute to 10 through unwavering daily resolve.',
     '⏳', 'attribute_value', 'discipline', 10, 35),

    -- Item count milestones
    ('Collector',
     'Acquire 5 items for your study sanctuary — the room is coming alive!',
     '🧺', 'item_count', NULL, 5, 30),

    ('Curator',
     'Acquire all 8 items in the Study Emporium — your sanctuary is complete.',
     '🏛️', 'item_count', NULL, 8, 80)

ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    criteria_type = EXCLUDED.criteria_type,
    criteria_attribute = EXCLUDED.criteria_attribute,
    criteria_value = EXCLUDED.criteria_value,
    reward_coins = EXCLUDED.reward_coins;
