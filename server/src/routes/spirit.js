import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin, supabase } from '../supabase.js';

const router = express.Router();
const getClient = () => supabaseAdmin || supabase;

// Default species & stage catalog fallback for development / offline resilience
export const FALLBACK_SPECIES = {
  focus: {
    name: 'Emberwisp',
    attribute_type: 'focus',
    lore_description: 'Born from the glowing embers of study hearths and candlelit tomes. Emberwisps thrive in moments of deep, unbroken concentration and illuminate late-night revisions.'
  },
  discipline: {
    name: 'Rootling',
    attribute_type: 'discipline',
    lore_description: 'Formed from ancient moss-clad river stones and patient roots. Rootlings embody steadfast resolve, unshakeable habit, and the quiet power of steady practice.'
  },
  vitality: {
    name: 'Sproutling',
    attribute_type: 'vitality',
    lore_description: 'Awoken by morning dew and crisp mountain air. Sproutlings pulse with rejuvenating life energy, encouraging scholars to stretch, breathe, and flourish.'
  },
  creativity: {
    name: 'Inkling',
    attribute_type: 'creativity',
    lore_description: 'Born from fountain pen swirls on fresh parchment and midnight starlight. Inklings inspire sudden artistic epiphanies, poetic verses, and boundless imagination.'
  }
};

export const FALLBACK_STAGES = {
  focus: [
    { stage_number: 1, name: 'Emberwisp Spark', description: 'A tiny steam-and-ember wisp glowing with soft golden light, bobbing inquisitively as you study.', unlock_level: 1, model_key: 'emberwisp_stage_1' },
    { stage_number: 2, name: 'Emberwisp Lantern', description: 'A crystallized brass-caged lantern wisp with flickering flame winglets and dancing ember motes.', unlock_level: 5, model_key: 'emberwisp_stage_2' },
    { stage_number: 3, name: 'Emberwisp Pyrespirit', description: 'A celestial hearth dragonling radiating brilliant golden warmth and trailing stellar flame ribbons.', unlock_level: 12, model_key: 'emberwisp_stage_3' }
  ],
  discipline: [
    { stage_number: 1, name: 'Rootling Pebble', description: 'A shy, rounded river pebble spirit with soft moss patches and two bright curious stone eyes.', unlock_level: 1, model_key: 'rootling_stage_1' },
    { stage_number: 2, name: 'Rootling Runeguard', description: 'A sturdy stone sentinel bound with glowing turquoise runic inlays, woody roots, and alpine flora.', unlock_level: 5, model_key: 'rootling_stage_2' },
    { stage_number: 3, name: 'Rootling Colossus', description: 'An ancient moss golem crowned with a weathered stone lantern shrine and orbiting runic stones.', unlock_level: 12, model_key: 'rootling_stage_3' }
  ],
  vitality: [
    { stage_number: 1, name: 'Sproutling Seed', description: 'A cheerful acorn-capped seed sprite with a fluttering twin clover sprout that spins when excited.', unlock_level: 1, model_key: 'sproutling_stage_1' },
    { stage_number: 2, name: 'Sproutling Bloom', description: 'An energetic flower-nymph wrapped in living ivy vines with fragrant blooming cherry blossoms.', unlock_level: 5, model_key: 'sproutling_stage_2' },
    { stage_number: 3, name: 'Sproutling Dryad', description: 'A breathtaking herald of vitality woven of blooming sakura wood with branch antlers and petal halos.', unlock_level: 12, model_key: 'sproutling_stage_3' }
  ],
  creativity: [
    { stage_number: 1, name: 'Inkling Droplet', description: 'A glossy deep indigo ink drop with starlight flecks and a quill tail, floating playfully above your papers.', unlock_level: 1, model_key: 'inkling_stage_1' },
    { stage_number: 2, name: 'Inkling Quillwing', description: 'A calligraphic origami ink bird with sharp feather plumage, trailing ink ribbons, and star-charted wings.', unlock_level: 5, model_key: 'inkling_stage_2' },
    { stage_number: 3, name: 'Inkling Leviathan', description: 'A cosmic astral ink wyrm composed of deep indigo nebula ink, golden calligraphy horns, and blazing starlight rings.', unlock_level: 12, model_key: 'inkling_stage_3' }
  ]
};

/**
 * Determine highest attribute for character.
 * When tied at character creation (all 1), defaults strictly to 'focus'.
 */
export function determineHighestAttribute(character) {
  const attrs = [
    { type: 'focus', value: (character?.focus || 1) + 0.1 }, // Tiebreaker bias for Focus
    { type: 'discipline', value: character?.discipline || 1 },
    { type: 'vitality', value: character?.vitality || 1 },
    { type: 'creativity', value: character?.creativity || 1 }
  ];

  attrs.sort((a, b) => b.value - a.value);
  return attrs[0].type;
}

/**
 * GET /api/spirit
 * Returns current user's bound Study Spirit, species lore, active stage model_key,
 * full evolutionary stage roadmap, and next evolution teaser.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const client = getClient();

    // 1. Fetch user's character
    const { data: character, error: charErr } = await client
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (charErr) throw charErr;
    const userLevel = character?.level || 1;
    const dominantAttr = determineHighestAttribute(character);

    // 2. Fetch user's spirit from user_spirits
    let userSpirit = null;
    let speciesData = null;
    let stagesData = [];

    try {
      const { data: existingSpirit, error: spiritErr } = await client
        .from('user_spirits')
        .select('*, species:spirit_species(*)')
        .eq('user_id', userId)
        .maybeSingle();

      if (!spiritErr && existingSpirit) {
        userSpirit = existingSpirit;
        speciesData = existingSpirit.species;
      }
    } catch (e) {
      console.warn('[Spirit Fetch Warning]', e.message);
    }

    // 3. Auto-adopt if no spirit bound yet
    if (!userSpirit) {
      try {
        // Find matching species
        const { data: speciesRow } = await client
          .from('spirit_species')
          .select('*')
          .eq('attribute_type', dominantAttr)
          .maybeSingle();

        if (speciesRow) {
          const startingStage = userLevel >= 12 ? 3 : (userLevel >= 5 ? 2 : 1);
          const { data: newSpirit } = await client
            .from('user_spirits')
            .insert({
              user_id: userId,
              species_id: speciesRow.id,
              current_stage: startingStage
            })
            .select('*, species:spirit_species(*)')
            .single();

          if (newSpirit) {
            userSpirit = newSpirit;
            speciesData = newSpirit.species || speciesRow;
          }
        }
      } catch (insertErr) {
        console.warn('[Spirit Auto-Adopt Warning]', insertErr.message);
      }
    }

    // 4. Fetch stages for this species
    if (speciesData?.id) {
      try {
        const { data: stages } = await client
          .from('spirit_stages')
          .select('*')
          .eq('species_id', speciesData.id)
          .order('stage_number', { ascending: true });

        if (stages && stages.length > 0) {
          stagesData = stages;
        }
      } catch (stgErr) {
        console.warn('[Spirit Stages Warning]', stgErr.message);
      }
    }

    // 5. Fallback assembly if DB tables are pending migration
    const attrType = speciesData?.attribute_type || dominantAttr;
    const finalSpecies = speciesData || {
      id: 'fallback-species',
      ...FALLBACK_SPECIES[attrType]
    };

    const finalStages = stagesData.length > 0 ? stagesData : FALLBACK_STAGES[attrType];
    const currentStageNum = userSpirit?.current_stage || (userLevel >= 12 ? 3 : (userLevel >= 5 ? 2 : 1));

    const currentStage = finalStages.find((s) => s.stage_number === currentStageNum) || finalStages[0];
    const nextStage = finalStages.find((s) => s.stage_number === currentStageNum + 1) || null;

    const nextStageTeaser = nextStage ? {
      ...nextStage,
      levels_remaining: Math.max(0, nextStage.unlock_level - userLevel)
    } : null;

    return res.status(200).json({
      spirit: {
        id: userSpirit?.id || 'spirit-bound',
        current_stage: currentStageNum,
        adopted_at: userSpirit?.adopted_at || new Date().toISOString()
      },
      species: finalSpecies,
      current_stage: currentStage,
      next_stage: nextStageTeaser,
      is_max_stage: currentStageNum >= 3,
      all_stages: finalStages.map((s) => ({
        ...s,
        is_unlocked: userLevel >= s.unlock_level,
        is_current: s.stage_number === currentStageNum
      })),
      character_level: userLevel,
      dominant_attribute: attrType
    });

  } catch (err) {
    console.error('[Get Spirit Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

export default router;
