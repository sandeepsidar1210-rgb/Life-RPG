-- ==============================================================================
-- Life RPG: Study Spirits Streak Guardian & Mechanical Benefits Migration
-- Column: user_spirits.grace_available (boolean)
-- ==============================================================================

-- 1. Add grace_available column to user_spirits
ALTER TABLE public.user_spirits
ADD COLUMN IF NOT EXISTS grace_available BOOLEAN NOT NULL DEFAULT false;

-- 2. Backfill grace_available: true if current_stage >= 2, false if stage 1
UPDATE public.user_spirits
SET grace_available = (current_stage >= 2);
