-- ==============================================================================
-- Life RPG: Study Spirits Companion-Evolution System Migration
-- Tables: spirit_species, spirit_stages, user_spirits
-- Seeds: 4 species, 12 evolution stages, 2 spirit achievements
-- ==============================================================================

-- 1. SPIRIT_SPECIES Table
CREATE TABLE IF NOT EXISTS public.spirit_species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attribute_type TEXT NOT NULL UNIQUE CHECK (attribute_type IN ('focus', 'discipline', 'vitality', 'creativity')),
    name TEXT NOT NULL UNIQUE,
    lore_description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. SPIRIT_STAGES Table (3 stages per species)
CREATE TABLE IF NOT EXISTS public.spirit_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    species_id UUID NOT NULL REFERENCES public.spirit_species(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL CHECK (stage_number IN (1, 2, 3)),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    unlock_level INTEGER NOT NULL CHECK (unlock_level >= 1),
    model_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (species_id, stage_number)
);

-- 3. USER_SPIRITS Table (One permanent spirit per scholar)
CREATE TABLE IF NOT EXISTS public.user_spirits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    species_id UUID NOT NULL REFERENCES public.spirit_species(id) ON DELETE RESTRICT,
    current_stage INTEGER NOT NULL DEFAULT 1 CHECK (current_stage IN (1, 2, 3)),
    adopted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_spirit_stages_species ON public.spirit_stages(species_id, stage_number);
CREATE INDEX IF NOT EXISTS idx_user_spirits_user ON public.user_spirits(user_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.spirit_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spirit_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_spirits ENABLE ROW LEVEL SECURITY;

-- Public read for catalog
DROP POLICY IF EXISTS "Public can view spirit species" ON public.spirit_species;
CREATE POLICY "Public can view spirit species"
    ON public.spirit_species FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public can view spirit stages" ON public.spirit_stages;
CREATE POLICY "Public can view spirit stages"
    ON public.spirit_stages FOR SELECT
    USING (true);

-- User-scoped CRUD for user_spirits
DROP POLICY IF EXISTS "Users can view own spirit" ON public.user_spirits;
CREATE POLICY "Users can view own spirit"
    ON public.user_spirits FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own spirit" ON public.user_spirits;
CREATE POLICY "Users can insert own spirit"
    ON public.user_spirits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own spirit" ON public.user_spirits;
CREATE POLICY "Users can update own spirit"
    ON public.user_spirits FOR UPDATE
    USING (auth.uid() = user_id);

-- 6. Seed the 4 Species
INSERT INTO public.spirit_species (attribute_type, name, lore_description)
VALUES
    (
        'focus',
        'Emberwisp',
        'Born from the glowing embers of study hearths and candlelit tomes. Emberwisps thrive in moments of deep, unbroken concentration and illuminate late-night revisions.'
    ),
    (
        'discipline',
        'Rootling',
        'Formed from ancient moss-clad river stones and patient roots. Rootlings embody steadfast resolve, unshakeable habit, and the quiet power of steady practice.'
    ),
    (
        'vitality',
        'Sproutling',
        'Awoken by morning dew and crisp mountain air. Sproutlings pulse with rejuvenating life energy, encouraging scholars to stretch, breathe, and flourish.'
    ),
    (
        'creativity',
        'Inkling',
        'Born from fountain pen swirls on fresh parchment and midnight starlight. Inklings inspire sudden artistic epiphanies, poetic verses, and boundless imagination.'
    )
ON CONFLICT (attribute_type) DO UPDATE
SET name = EXCLUDED.name,
    lore_description = EXCLUDED.lore_description;

-- 7. Seed the 12 Stages (3 per species)
-- Emberwisp (Focus)
INSERT INTO public.spirit_stages (species_id, stage_number, name, description, unlock_level, model_key)
VALUES
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'focus'),
        1,
        'Emberwisp Spark',
        'A tiny steam-and-ember wisp glowing with soft golden light, bobbing inquisitively as you study.',
        1,
        'emberwisp_stage_1'
    ),
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'focus'),
        2,
        'Emberwisp Lantern',
        'A crystallized brass-caged lantern wisp with flickering flame winglets and dancing ember motes.',
        5,
        'emberwisp_stage_2'
    ),
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'focus'),
        3,
        'Emberwisp Pyrespirit',
        'A celestial hearth dragonling radiating brilliant golden warmth and trailing stellar flame ribbons.',
        12,
        'emberwisp_stage_3'
    ),
-- Rootling (Discipline)
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'discipline'),
        1,
        'Rootling Pebble',
        'A shy, rounded river pebble spirit with soft moss patches and two bright curious stone eyes.',
        1,
        'rootling_stage_1'
    ),
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'discipline'),
        2,
        'Rootling Runeguard',
        'A sturdy stone sentinel bound with glowing turquoise runic inlays, woody roots, and alpine flora.',
        5,
        'rootling_stage_2'
    ),
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'discipline'),
        3,
        'Rootling Colossus',
        'An ancient moss golem crowned with a weathered stone lantern shrine and orbiting runic stones.',
        12,
        'rootling_stage_3'
    ),
-- Sproutling (Vitality)
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'vitality'),
        1,
        'Sproutling Seed',
        'A cheerful acorn-capped seed sprite with a fluttering twin clover sprout that spins when excited.',
        1,
        'sproutling_stage_1'
    ),
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'vitality'),
        2,
        'Sproutling Bloom',
        'An energetic flower-nymph wrapped in living ivy vines with fragrant blooming cherry blossoms.',
        5,
        'sproutling_stage_2'
    ),
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'vitality'),
        3,
        'Sproutling Dryad',
        'A breathtaking herald of vitality woven of blooming sakura wood with branch antlers and petal halos.',
        12,
        'sproutling_stage_3'
    ),
-- Inkling (Creativity)
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'creativity'),
        1,
        'Inkling Droplet',
        'A glossy deep indigo ink drop with starlight flecks and a quill tail, floating playfully above your papers.',
        1,
        'inkling_stage_1'
    ),
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'creativity'),
        2,
        'Inkling Quillwing',
        'A calligraphic origami ink bird with sharp feather plumage, trailing ink ribbons, and star-charted wings.',
        5,
        'inkling_stage_2'
    ),
    (
        (SELECT id FROM public.spirit_species WHERE attribute_type = 'creativity'),
        3,
        'Inkling Leviathan',
        'A cosmic astral ink wyrm composed of deep indigo nebula ink, golden calligraphy horns, and blazing starlight rings.',
        12,
        'inkling_stage_3'
    )
ON CONFLICT (species_id, stage_number) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    unlock_level = EXCLUDED.unlock_level,
    model_key = EXCLUDED.model_key;

-- 8. Seed New Spirit Achievements
INSERT INTO public.achievements (name, description, criteria_type, criteria_value, criteria_attribute, cozy_coins_reward, icon)
VALUES
    (
        'Spirit Kin',
        'Attune deeply with your study companion and achieve your first Spirit Evolution (Stage 2).',
        'spirit_stage',
        2,
        NULL,
        50,
        '✨'
    ),
    (
        'Astral Bond',
        'Ascend your study companion to its magnificent Stage 3 final evolution form.',
        'spirit_stage',
        3,
        NULL,
        100,
        '🌟'
    )
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description,
    criteria_type = EXCLUDED.criteria_type,
    criteria_value = EXCLUDED.criteria_value,
    cozy_coins_reward = EXCLUDED.cozy_coins_reward,
    icon = EXCLUDED.icon;

-- 9. Backfill existing scholars: Adopt spirit matching highest attribute (tiebreaker defaults to Focus)
INSERT INTO public.user_spirits (user_id, species_id, current_stage)
SELECT
    c.user_id,
    (
        SELECT s.id FROM public.spirit_species s
        ORDER BY (
            CASE s.attribute_type
                WHEN 'focus' THEN COALESCE(c.focus, 1) + 0.1
                WHEN 'discipline' THEN COALESCE(c.discipline, 1)
                WHEN 'vitality' THEN COALESCE(c.vitality, 1)
                WHEN 'creativity' THEN COALESCE(c.creativity, 1)
            END
        ) DESC, s.name ASC
        LIMIT 1
    ) as species_id,
    CASE 
        WHEN COALESCE(c.level, 1) >= 12 THEN 3
        WHEN COALESCE(c.level, 1) >= 5 THEN 2
        ELSE 1
    END as current_stage
FROM public.characters c
ON CONFLICT (user_id) DO NOTHING;
