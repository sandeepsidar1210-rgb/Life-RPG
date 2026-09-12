-- ==============================================================================
-- Life RPG Database Schema & Migration
-- Tables: characters, quests, streaks, items, inventory
-- Row Level Security (RLS) & Cascade Deletes on auth.users(id)
-- ==============================================================================

-- 1. Enable UUID Extension if not already active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CHARACTERS Table (One character per auth.user)
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
    current_xp INTEGER NOT NULL DEFAULT 0 CHECK (current_xp >= 0),
    xp_to_next_level INTEGER NOT NULL DEFAULT 100 CHECK (xp_to_next_level > 0),
    cozy_coins INTEGER NOT NULL DEFAULT 0 CHECK (cozy_coins >= 0),
    focus INTEGER NOT NULL DEFAULT 1 CHECK (focus >= 1),
    discipline INTEGER NOT NULL DEFAULT 1 CHECK (discipline >= 1),
    vitality INTEGER NOT NULL DEFAULT 1 CHECK (vitality >= 1),
    creativity INTEGER NOT NULL DEFAULT 1 CHECK (creativity >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. QUESTS Table (Tasks with RPG rewards and attribute categorization)
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (char_length(trim(title)) >= 2),
    description TEXT,
    attribute_type TEXT NOT NULL CHECK (attribute_type IN ('focus', 'discipline', 'vitality', 'creativity')),
    focus_points_reward INTEGER NOT NULL DEFAULT 25 CHECK (focus_points_reward >= 0),
    cozy_coins_reward INTEGER NOT NULL DEFAULT 10 CHECK (cozy_coins_reward >= 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. STREAKS Table (Tracks consecutive days of activity)
CREATE TABLE IF NOT EXISTS public.streaks (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
    last_completed_date DATE
);

-- 5. ITEMS Table (Shop catalog for decor, companions, badges)
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    cost INTEGER NOT NULL CHECK (cost >= 0),
    category TEXT NOT NULL CHECK (category IN ('decor', 'companion', 'badge')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. INVENTORY Table (Items acquired and equipped by users)
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    equipped BOOLEAN NOT NULL DEFAULT false
);

-- 7. Query Performance Indexes
CREATE INDEX IF NOT EXISTS idx_quests_user_id ON public.quests(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_status ON public.quests(status);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_item_id ON public.inventory(item_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all 5 tables
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- CHARACTERS RLS Policies (Strict user_id = auth.uid())
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can select own character" ON public.characters;
CREATE POLICY "Users can select own character" 
    ON public.characters FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own character" ON public.characters;
CREATE POLICY "Users can insert own character" 
    ON public.characters FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own character" ON public.characters;
CREATE POLICY "Users can update own character" 
    ON public.characters FOR UPDATE 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own character" ON public.characters;
CREATE POLICY "Users can delete own character" 
    ON public.characters FOR DELETE 
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- QUESTS RLS Policies (Strict user_id = auth.uid())
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can select own quests" ON public.quests;
CREATE POLICY "Users can select own quests" 
    ON public.quests FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quests" ON public.quests;
CREATE POLICY "Users can insert own quests" 
    ON public.quests FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own quests" ON public.quests;
CREATE POLICY "Users can update own quests" 
    ON public.quests FOR UPDATE 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own quests" ON public.quests;
CREATE POLICY "Users can delete own quests" 
    ON public.quests FOR DELETE 
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- STREAKS RLS Policies (Strict user_id = auth.uid())
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can select own streaks" ON public.streaks;
CREATE POLICY "Users can select own streaks" 
    ON public.streaks FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own streaks" ON public.streaks;
CREATE POLICY "Users can insert own streaks" 
    ON public.streaks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own streaks" ON public.streaks;
CREATE POLICY "Users can update own streaks" 
    ON public.streaks FOR UPDATE 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own streaks" ON public.streaks;
CREATE POLICY "Users can delete own streaks" 
    ON public.streaks FOR DELETE 
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- INVENTORY RLS Policies (Strict user_id = auth.uid())
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can select own inventory" ON public.inventory;
CREATE POLICY "Users can select own inventory" 
    ON public.inventory FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own inventory" ON public.inventory;
CREATE POLICY "Users can insert own inventory" 
    ON public.inventory FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own inventory" ON public.inventory;
CREATE POLICY "Users can update own inventory" 
    ON public.inventory FOR UPDATE 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own inventory" ON public.inventory;
CREATE POLICY "Users can delete own inventory" 
    ON public.inventory FOR DELETE 
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- ITEMS RLS Policies (Public readable catalog, write protected)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow all users to view shop items" ON public.items;
CREATE POLICY "Allow all users to view shop items" 
    ON public.items FOR SELECT 
    USING (true);

-- ==============================================================================
-- TRIGGER: Auto-create Character & Streak profile on new user signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_character()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.characters (user_id, level, current_xp, xp_to_next_level, cozy_coins, focus, discipline, vitality, creativity)
    VALUES (NEW.id, 1, 0, 100, 50, 1, 1, 1, 1)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.streaks (user_id, current_streak, longest_streak)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_character();

-- ==============================================================================
-- SEED DATA: 8 Cozy Study Room Themed Items
-- ==============================================================================
INSERT INTO public.items (name, description, cost, category)
VALUES
    ('Potted Succulent', 'A hardy little desk plant that purifies study air and fosters Vitality.', 40, 'decor'),
    ('Warm Desk Lamp', 'Emits a soft amber glow to keep eye strain away during late-night Focus sessions.', 60, 'decor'),
    ('Sleepy Calico Cat', 'A gentle purring companion curled up peacefully on your study blanket.', 180, 'companion'),
    ('Oak Bookshelf', 'A miniature wooden bookshelf stacked with timeless wisdom and quest journals.', 110, 'decor'),
    ('Ceremonial Matcha Bowl', 'Freshly whisked green tea to sharpen mental clarity and boost Discipline.', 35, 'decor'),
    ('Lo-Fi Cassette Player', 'Plays warm ambient study beats to drown out distractions and induce flow state.', 140, 'decor'),
    ('Dawn Scholar Badge', 'An etched copper badge recognizing dedicated students who conquer morning quests.', 85, 'badge'),
    ('Zen Bonsai Tree', 'A miniature sculpted pine tree embodying patience, persistence, and inner balance.', 220, 'decor')
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    cost = EXCLUDED.cost,
    category = EXCLUDED.category;
