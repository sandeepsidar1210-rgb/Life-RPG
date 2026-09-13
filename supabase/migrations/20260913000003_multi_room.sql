-- ==============================================================================
-- Life RPG Multi-Room 3D Sanctuary Migration
-- Tables: rooms, inventory (add room_id)
-- Seeds: Study Desk (Lv. 1), Reading Nook (Lv. 5), Garden Balcony (Lv. 10)
-- ==============================================================================

-- 1. ROOMS Table (global room catalog)
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    unlock_level INTEGER NOT NULL CHECK (unlock_level >= 1),
    display_order INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add room_id to inventory table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'inventory' 
          AND column_name = 'room_id'
    ) THEN
        ALTER TABLE public.inventory 
        ADD COLUMN room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_rooms_display_order ON public.rooms(display_order);
CREATE INDEX IF NOT EXISTS idx_inventory_room_id ON public.inventory(room_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Rooms catalog is public readable (like items and achievements)
DROP POLICY IF EXISTS "All users can view rooms" ON public.rooms;
CREATE POLICY "All users can view rooms"
    ON public.rooms FOR SELECT
    USING (true);

-- 5. Seed the 3 Rooms
INSERT INTO public.rooms (name, description, unlock_level, display_order)
VALUES
    (
        'Study Desk',
        'Your classical wooden desk sanctuary with warm lamplight, parchment notes, and peaceful afternoon sun streaming through the window.',
        1,
        1
    ),
    (
        'Reading Nook',
        'A cozy, intimate corner framed by tall mahogany bookshelves, a plush study armchair, and soft ambient twilight.',
        5,
        2
    ),
    (
        'Garden Balcony',
        'An open-air stone terrace overlooking rolling greenery, with climbing ivy, gentle mountain breeze, and warm sunlight.',
        10,
        3
    )
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    unlock_level = EXCLUDED.unlock_level,
    display_order = EXCLUDED.display_order;

-- 6. Backfill existing equipped items to default "Study Desk" room so nothing breaks
UPDATE public.inventory
SET room_id = (SELECT id FROM public.rooms WHERE name = 'Study Desk' LIMIT 1)
WHERE equipped = true AND room_id IS NULL;
