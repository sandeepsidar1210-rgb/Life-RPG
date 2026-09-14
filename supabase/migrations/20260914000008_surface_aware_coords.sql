-- ==============================================================================
-- Migration: 20260914000008_surface_aware_coords.sql
-- Description: Add position_y and surface columns to inventory table for surface-aware item stacking.
-- ==============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'inventory' 
          AND column_name = 'position_y'
    ) THEN
        ALTER TABLE public.inventory 
        ADD COLUMN position_y DOUBLE PRECISION DEFAULT 0,
        ADD COLUMN surface TEXT DEFAULT 'floor';
    END IF;
END $$;
