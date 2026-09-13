-- ==============================================================================
-- Life RPG: Study Spirits Menagerie, Species Switching & Greeting Migration
-- Tables/Columns:
--   - spirit_species: add unlock_level column
--   - user_unlocked_spirits: table tracking species unlocked per scholar
--   - user_spirits: add active_species_id and last_greeted_at columns
-- ==============================================================================

-- 1. Add unlock_level to spirit_species (Staggered progression)
ALTER TABLE public.spirit_species
ADD COLUMN IF NOT EXISTS unlock_level INTEGER NOT NULL DEFAULT 1;

-- Seed staggered unlock levels across the 4 species:
-- Emberwisp (Focus): Level 1 (Starting companion)
-- Rootling (Discipline): Level 3
-- Sproutling (Vitality): Level 7
-- Inkling (Creativity): Level 10
UPDATE public.spirit_species SET unlock_level = 1 WHERE attribute_type = 'focus';
UPDATE public.spirit_species SET unlock_level = 3 WHERE attribute_type = 'discipline';
UPDATE public.spirit_species SET unlock_level = 7 WHERE attribute_type = 'vitality';
UPDATE public.spirit_species SET unlock_level = 10 WHERE attribute_type = 'creativity';

-- 2. Create user_unlocked_spirits Table
CREATE TABLE IF NOT EXISTS public.user_unlocked_spirits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    species_id UUID NOT NULL REFERENCES public.spirit_species(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, species_id)
);

-- Index for speedy lookups
CREATE INDEX IF NOT EXISTS idx_user_unlocked_spirits_user ON public.user_unlocked_spirits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_unlocked_spirits_species ON public.user_unlocked_spirits(species_id);

-- Enable RLS
ALTER TABLE public.user_unlocked_spirits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own unlocked spirits" ON public.user_unlocked_spirits;
CREATE POLICY "Users can view own unlocked spirits"
    ON public.user_unlocked_spirits FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlock spirits" ON public.user_unlocked_spirits;
CREATE POLICY "Users can unlock spirits"
    ON public.user_unlocked_spirits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 3. Add active_species_id and last_greeted_at to user_spirits
ALTER TABLE public.user_spirits
ADD COLUMN IF NOT EXISTS active_species_id UUID REFERENCES public.spirit_species(id) ON DELETE RESTRICT;

ALTER TABLE public.user_spirits
ADD COLUMN IF NOT EXISTS last_greeted_at TIMESTAMPTZ;

-- 4. Backfill existing user_spirits:
-- a) Default active_species_id to their original species_id if not set
UPDATE public.user_spirits
SET active_species_id = species_id
WHERE active_species_id IS NULL;

-- b) Automatically grant original adopted species in user_unlocked_spirits
INSERT INTO public.user_unlocked_spirits (user_id, species_id)
SELECT user_id, species_id
FROM public.user_spirits
ON CONFLICT (user_id, species_id) DO NOTHING;

-- c) Unlock any other species where scholar level meets unlock_level threshold
INSERT INTO public.user_unlocked_spirits (user_id, species_id)
SELECT c.user_id, s.id as species_id
FROM public.characters c
CROSS JOIN public.spirit_species s
WHERE c.level >= s.unlock_level
ON CONFLICT (user_id, species_id) DO NOTHING;
