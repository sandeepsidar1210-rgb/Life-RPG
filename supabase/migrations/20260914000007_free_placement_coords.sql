-- ==============================================================================
-- Migration: 20260914000007_free_placement_coords.sql
-- Description: Add exact 3D coordinates (position_x, position_z, rotation_y)
-- to inventory table to support free user-controlled placement and dragging.
-- ==============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'inventory' 
          AND column_name = 'position_x'
    ) THEN
        ALTER TABLE public.inventory 
        ADD COLUMN position_x DOUBLE PRECISION DEFAULT NULL,
        ADD COLUMN position_z DOUBLE PRECISION DEFAULT NULL,
        ADD COLUMN rotation_y DOUBLE PRECISION DEFAULT 0;
    END IF;
END $$;
