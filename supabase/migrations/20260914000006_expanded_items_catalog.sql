-- ==============================================================================
-- Migration: 20260914000006_expanded_items_catalog.sql
-- Description: Expand the Study Emporium catalog to 22 items across decor,
-- companions, and badges with varied price progression and room appropriateness.
-- ==============================================================================

INSERT INTO public.items (name, description, cost, category)
VALUES
    ('Ceremonial Matcha Bowl', 'Freshly whisked green tea to sharpen mental clarity and boost Discipline.', 35, 'decor'),
    ('Potted Succulent', 'A hardy little desk plant that purifies study air and fosters Vitality.', 40, 'decor'),
    ('Starlight Candle Trio', 'Three soothing beeswax candles that cast dancing shadows across your study papers.', 50, 'decor'),
    ('Warm Desk Lamp', 'Emits a soft amber glow to keep eye strain away during late-night Focus sessions.', 60, 'decor'),
    ('Cozy Floor Pouf', 'A woven bohemian knitted floor cushion ideal for relaxed reading sessions.', 65, 'decor'),
    ('Monstera Deliciosa', 'A lush tropical plant with broad fenestrated leaves that bring vibrant natural calm.', 75, 'decor'),
    ('Dawn Scholar Badge', 'An etched copper badge recognizing dedicated students who conquer morning quests.', 85, 'badge'),
    ('Terracotta Herb Planter', 'A rustic clay planter with fresh rosemary, garden mint, and thyme.', 90, 'decor'),
    ('Oak Bookshelf', 'A miniature wooden bookshelf stacked with timeless wisdom and quest journals.', 110, 'decor'),
    ('Midnight Oil Badge', 'A silver pin awarded to persistent scholars conquering late-night revisions.', 120, 'badge'),
    ('Woven Persian Rug', 'An intricate ruby and sapphire wool rug featuring antique geometric motifs.', 130, 'decor'),
    ('Lo-Fi Cassette Player', 'Plays warm ambient study beats to drown out distractions and induce flow state.', 140, 'decor'),
    ('Vintage Brass Astrolabe', 'An antique astronomical instrument with interlocking bronze rings and engraved star coordinates.', 160, 'decor'),
    ('Sleepy Calico Cat', 'A gentle purring companion curled up peacefully on your study blanket.', 180, 'companion'),
    ('Velvet Reading Armchair', 'A luxurious tufted burgundy armchair paired with an embroidered study throw pillow.', 190, 'decor'),
    ('Wise Study Owl', 'An observant horned owl companion that keeps silent, watchful guard from its perch.', 210, 'companion'),
    ('Zen Bonsai Tree', 'A miniature sculpted pine tree embodying patience, persistence, and inner balance.', 220, 'decor'),
    ('Antique Gramophone', 'A polished mahogany player with a fluted brass horn spinning vintage classical wax cylinders.', 240, 'decor'),
    ('Master Archivist Badge', 'A gilded laurel insignia celebrating exemplary devotion to knowledge and scholarly archives.', 250, 'badge'),
    ('Grandfather Clock', 'A majestic walnut pendulum clock marking focused study pomodoros with gentle chimes.', 280, 'decor'),
    ('Loyal Shiba Inu', 'A cheerful curled-tail canine companion who waits faithfully by your desk.', 320, 'companion'),
    ('Celestial Horizon Badge', 'An iridescent badge forged from starlight and cosmic curiosity for grandmasters of study.', 400, 'badge')
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    cost = EXCLUDED.cost,
    category = EXCLUDED.category;
