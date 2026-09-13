import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin, supabase } from '../supabase.js';

const router = express.Router();
const getClient = () => supabaseAdmin || supabase;

export const GREETING_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 Hours

// Default species catalog with unlock levels and personality flavor lines
export const FALLBACK_SPECIES = {
  focus: {
    id: 'species-focus-emberwisp',
    name: 'Emberwisp',
    attribute_type: 'focus',
    unlock_level: 1,
    lore_description: 'Born from the glowing embers of study hearths and candlelit tomes. Emberwisps thrive in moments of deep, unbroken concentration and illuminate late-night revisions.',
    personality_lines: [
      'Emberwisp crackles warmly, showering tiny golden sparks over your notebook in cheerful encouragement!',
      'A cozy puff of fragrant matcha steam rises as Emberwisp gently nuzzles your cheek.',
      'Emberwisp’s flame brightens with a contented purr, warming your hands as you study.',
      'A playful ring of miniature dancing embers twirls merrily before settling softly on your desk.',
      'Emberwisp chirps with radiant heat, illuminating your notes with renewed clarity and warmth!'
    ],
    resting_line: 'Emberwisp is curled into a sleepy ember ball, quietly dozing beside the warm tea kettle.'
  },
  discipline: {
    id: 'species-discipline-rootling',
    name: 'Rootling',
    attribute_type: 'discipline',
    unlock_level: 3,
    lore_description: 'Formed from ancient moss-clad river stones and patient roots. Rootlings embody steadfast resolve, unshakeable habit, and the quiet power of steady practice.',
    personality_lines: [
      'Rootling gently bumps against your knuckle with a soft "thud", radiating steady resolve.',
      'Tiny moss blossoms unfurl on Rootling’s back as it lets out a contented, rumbling stone hum.',
      'Rootling places a cool, smooth river pebble beside your notes — a token of steadfast discipline.',
      'The turquoise runes across Rootling pulse with a reassuring, ancient rhythmic glow.',
      'Rootling wiggles its stubby stone feet happily, standing firm as your unshakeable guardian.'
    ],
    resting_line: 'Rootling has nestled deeply into its cozy moss bed, soaking up the quiet earth stillness.'
  },
  vitality: {
    id: 'species-vitality-sproutling',
    name: 'Sproutling',
    attribute_type: 'vitality',
    unlock_level: 7,
    lore_description: 'Awoken by morning dew and crisp mountain air. Sproutlings pulse with rejuvenating life energy, encouraging scholars to stretch, breathe, and flourish.',
    personality_lines: [
      'Sproutling’s twin clover leaves spin like a tiny propeller, fluttering a refreshing breeze across your desk!',
      'Sproutling giggles with dewdrop sparkles, offering you a sweet-smelling miniature blossom!',
      'With a playful hop, Sproutling lands on your shoulder, chirping a cheerful reminder to hydrate and stretch.',
      'A wave of fresh pine and morning meadow fragrance washes over you as Sproutling bounces with joy.',
      'Sproutling’s rosy cheeks glow brightly as it performs an enthusiastic celebratory victory twirl!'
    ],
    resting_line: 'Sproutling has tucked itself under a soft maple leaf, peacefully catching the sun’s gentle rays.'
  },
  creativity: {
    id: 'species-creativity-inkling',
    name: 'Inkling',
    attribute_type: 'creativity',
    unlock_level: 10,
    lore_description: 'Born from fountain pen swirls on fresh parchment and midnight starlight. Inklings inspire sudden artistic epiphanies, poetic verses, and boundless imagination.',
    personality_lines: [
      'Inkling swirls through the air in a graceful calligraphic loop, leaving a shimmering starlight ribbon in its wake!',
      'Inkling dips its golden quill tip playfully onto your margin, sketching a tiny twinkling constellation.',
      'A faint chime of midnight bells echoes as Inkling’s nebula colors shift from deep indigo to iridescent violet.',
      'Inkling playfully nudges your pen, humming an ethereal melody of sudden inspiration.',
      'Starlight flecks dance within Inkling’s droplet tail as it bows with cosmic scholar elegance.'
    ],
    resting_line: 'Inkling is floating serenely in a suspension of midnight ink, quietly dreaming up new constellations.'
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

// In-memory runtime cache for fallback resilience (user-specific spirit state)
export const fallbackSpiritState = new Map();

export function getOrCreateFallbackState(userId, dominantAttr = 'focus') {
  if (!fallbackSpiritState.has(userId)) {
    fallbackSpiritState.set(userId, {
      original_species: dominantAttr,
      active_species: dominantAttr,
      unlocked_species: new Set([dominantAttr]),
      last_greeted_at: null
    });
  }
  return fallbackSpiritState.get(userId);
}

/**
 * Format milliseconds into human-friendly time string (e.g. "3h 42m" or "45s")
 */
export function formatCooldown(ms) {
  if (ms <= 0) return 'Ready';
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

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
 * Compute current stage number from character level
 */
export function getStageFromLevel(level = 1) {
  if (level >= 12) return 3;
  if (level >= 5) return 2;
  return 1;
}

/**
 * GET /api/spirit
 * Returns current user's bound active Study Spirit, active species lore,
 * active stage model_key, full evolutionary stage roadmap, next evolution teaser,
 * and current greeting cooldown status.
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
    const fbState = getOrCreateFallbackState(userId, dominantAttr);

    // 2. Fetch user's spirit from user_spirits
    let userSpirit = null;
    let speciesData = null;
    let stagesData = [];

    try {
      const { data: existingSpirit, error: spiritErr } = await client
        .from('user_spirits')
        .select('*, species:spirit_species(*), active_species:spirit_species!user_spirits_active_species_id_fkey(*)')
        .eq('user_id', userId)
        .maybeSingle();

      if (!spiritErr && existingSpirit) {
        userSpirit = existingSpirit;
        speciesData = existingSpirit.active_species || existingSpirit.species;
      }
    } catch (e) {
      // Try simpler query without foreign key alias if migration is pending
      try {
        const { data: simpleSpirit } = await client
          .from('user_spirits')
          .select('*, species:spirit_species(*)')
          .eq('user_id', userId)
          .maybeSingle();
        if (simpleSpirit) {
          userSpirit = simpleSpirit;
          speciesData = simpleSpirit.species;
        }
      } catch (_inner) {
        console.warn('[Spirit Fetch Warning]', e.message);
      }
    }

    // 3. Auto-adopt if no spirit bound yet
    if (!userSpirit) {
      try {
        const { data: speciesRow } = await client
          .from('spirit_species')
          .select('*')
          .eq('attribute_type', dominantAttr)
          .maybeSingle();

        if (speciesRow) {
          const startingStage = getStageFromLevel(userLevel);
          const { data: newSpirit } = await client
            .from('user_spirits')
            .insert({
              user_id: userId,
              species_id: speciesRow.id,
              active_species_id: speciesRow.id,
              current_stage: startingStage
            })
            .select('*, species:spirit_species(*)')
            .single();

          if (newSpirit) {
            userSpirit = newSpirit;
            speciesData = newSpirit.species || speciesRow;
          }

          // Also record in user_unlocked_spirits
          await client
            .from('user_unlocked_spirits')
            .insert({ user_id: userId, species_id: speciesRow.id })
            .maybeSingle();
        }
      } catch (insertErr) {
        console.warn('[Spirit Auto-Adopt Warning]', insertErr.message);
      }
    }

    // Determine active species attribute
    const activeAttr = speciesData?.attribute_type || fbState.active_species || dominantAttr;
    const finalSpecies = {
      ...FALLBACK_SPECIES[activeAttr],
      ...(speciesData || {})
    };

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

    const finalStages = stagesData.length > 0 ? stagesData : FALLBACK_STAGES[activeAttr];
    const currentStageNum = getStageFromLevel(userLevel);
    const currentStage = finalStages.find((s) => s.stage_number === currentStageNum) || finalStages[0];
    const nextStage = finalStages.find((s) => s.stage_number === currentStageNum + 1) || null;

    const nextStageTeaser = nextStage ? {
      ...nextStage,
      levels_remaining: Math.max(0, nextStage.unlock_level - userLevel)
    } : null;

    // Cooldown evaluation
    const lastGreetedAt = userSpirit?.last_greeted_at || fbState.last_greeted_at;
    let isOnCooldown = false;
    let cooldownRemainingMs = 0;
    if (lastGreetedAt) {
      const elapsed = Date.now() - new Date(lastGreetedAt).getTime();
      if (elapsed < GREETING_COOLDOWN_MS) {
        isOnCooldown = true;
        cooldownRemainingMs = GREETING_COOLDOWN_MS - elapsed;
      }
    }

    return res.status(200).json({
      spirit: {
        id: userSpirit?.id || 'spirit-bound',
        species_id: userSpirit?.species_id || finalSpecies.id,
        active_species_id: userSpirit?.active_species_id || finalSpecies.id,
        current_stage: currentStageNum,
        adopted_at: userSpirit?.adopted_at || new Date().toISOString(),
        last_greeted_at: lastGreetedAt
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
      dominant_attribute: dominantAttr,
      greeting_status: {
        is_on_cooldown: isOnCooldown,
        cooldown_remaining_ms: cooldownRemainingMs,
        cooldown_remaining_formatted: formatCooldown(cooldownRemainingMs),
        cooldown_total_hours: 4
      }
    });

  } catch (err) {
    console.error('[Get Spirit Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

/**
 * GET /api/spirit/menagerie
 * Returns all 4 species with unlock status, current stage (based on user's character level),
 * and which one is currently active.
 */
router.get('/menagerie', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const client = getClient();

    // 1. Fetch character
    const { data: character } = await client
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const userLevel = character?.level || 1;
    const dominantAttr = determineHighestAttribute(character);
    const fbState = getOrCreateFallbackState(userId, dominantAttr);

    // 2. Fetch user's spirit record
    let userSpirit = null;
    try {
      const { data: sRow } = await client
        .from('user_spirits')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      userSpirit = sRow;
    } catch (_e) {}

    // Determine active species and originally adopted species
    const activeSpeciesId = userSpirit?.active_species_id || userSpirit?.species_id;
    const originalSpeciesId = userSpirit?.species_id;

    // 3. Fetch user_unlocked_spirits from DB
    const unlockedSpeciesIds = new Set();
    try {
      const { data: unlockedRows } = await client
        .from('user_unlocked_spirits')
        .select('species_id')
        .eq('user_id', userId);

      if (unlockedRows) {
        unlockedRows.forEach((r) => unlockedSpeciesIds.add(r.species_id));
      }
    } catch (_uErr) {}

    // 4. Fetch all species from spirit_species table (if available)
    let dbSpecies = [];
    try {
      const { data: speciesRows } = await client
        .from('spirit_species')
        .select('*')
        .order('unlock_level', { ascending: true });
      if (speciesRows && speciesRows.length > 0) {
        dbSpecies = speciesRows;
      }
    } catch (_sErr) {}

    // Build menagerie array covering all 4 attribute types
    const types = ['focus', 'discipline', 'vitality', 'creativity'];
    const menagerie = types.map((attr) => {
      const fallbackSpec = FALLBACK_SPECIES[attr];
      const dbRow = dbSpecies.find((s) => s.attribute_type === attr);
      const specId = dbRow?.id || fallbackSpec.id;
      const unlockLevel = dbRow?.unlock_level || fallbackSpec.unlock_level;

      // Unlocked if:
      // a) It's the user's originally adopted species (unlocked at Lv 1)
      // b) In DB user_unlocked_spirits table
      // c) In in-memory fallback unlocked_species Set
      // d) Character level meets unlock_level threshold
      const isOriginal = (originalSpeciesId && (originalSpeciesId === specId || originalSpeciesId === fallbackSpec.id)) ||
                         fbState.original_species === attr;

      const isUnlocked = isOriginal ||
                         unlockedSpeciesIds.has(specId) ||
                         fbState.unlocked_species.has(attr) ||
                         userLevel >= unlockLevel;

      // Active status
      const isActive = activeSpeciesId
        ? (activeSpeciesId === specId || (fbState.active_species === attr && !dbRow))
        : fbState.active_species === attr;

      // Current evolutionary stage for this species based on user level
      const currentStageNum = getStageFromLevel(userLevel);
      const stages = FALLBACK_STAGES[attr] || [];
      const currentStage = stages.find((s) => s.stage_number === currentStageNum) || stages[0];

      return {
        id: specId,
        code: attr,
        name: dbRow?.name || fallbackSpec.name,
        attribute_type: attr,
        unlock_level: isOriginal ? 1 : unlockLevel,
        lore_description: dbRow?.lore_description || fallbackSpec.lore_description,
        is_unlocked: isUnlocked,
        is_active: isActive,
        is_original: isOriginal,
        levels_remaining: isUnlocked ? 0 : Math.max(0, unlockLevel - userLevel),
        current_stage: {
          stage_number: currentStageNum,
          name: currentStage.name,
          description: currentStage.description,
          model_key: currentStage.model_key
        },
        all_stages: stages
      };
    });

    return res.status(200).json({
      menagerie,
      character_level: userLevel,
      active_species_id: menagerie.find((m) => m.is_active)?.id || menagerie[0].id
    });

  } catch (err) {
    console.error('[Get Menagerie Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

/**
 * PATCH /api/spirit/active
 * Switches the scholar's active species. Only allowed if target species is unlocked for this user.
 */
router.patch('/active', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const client = getClient();
    const { species_id, attribute_type } = req.body;

    if (!species_id && !attribute_type) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Please provide either species_id or attribute_type to switch active spirit.'
      });
    }

    // 1. Fetch character
    const { data: character } = await client
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const userLevel = character?.level || 1;
    const dominantAttr = determineHighestAttribute(character);
    const fbState = getOrCreateFallbackState(userId, dominantAttr);

    // 2. Identify target species
    let targetAttr = attribute_type;
    let targetSpecies = null;

    if (species_id) {
      try {
        const { data: row } = await client
          .from('spirit_species')
          .select('*')
          .eq('id', species_id)
          .maybeSingle();
        if (row) {
          targetSpecies = row;
          targetAttr = row.attribute_type;
        }
      } catch (_e) {}

      if (!targetSpecies) {
        // Look up by fallback ID
        for (const [attr, spec] of Object.entries(FALLBACK_SPECIES)) {
          if (spec.id === species_id) {
            targetAttr = attr;
            targetSpecies = spec;
            break;
          }
        }
      }
    }

    if (!targetSpecies && targetAttr) {
      targetSpecies = FALLBACK_SPECIES[targetAttr];
    }

    if (!targetSpecies) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Spirit species could not be found.'
      });
    }

    // 3. Verify target species is UNLOCKED for this user
    const isOriginal = fbState.original_species === targetAttr;
    const meetsLevel = userLevel >= (targetSpecies.unlock_level || 1);
    let isUnlocked = isOriginal || meetsLevel || fbState.unlocked_species.has(targetAttr);

    if (!isUnlocked && targetSpecies.id) {
      try {
        const { data: unlockedRow } = await client
          .from('user_unlocked_spirits')
          .select('*')
          .eq('user_id', userId)
          .eq('species_id', targetSpecies.id)
          .maybeSingle();

        if (unlockedRow) {
          isUnlocked = true;
        }
      } catch (_uErr) {}
    }

    if (!isUnlocked) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `This spirit species is locked. You must reach Level ${targetSpecies.unlock_level} to attune with ${targetSpecies.name}.`,
        unlock_level: targetSpecies.unlock_level,
        character_level: userLevel
      });
    }

    // 4. Update in database
    try {
      await client
        .from('user_spirits')
        .update({ active_species_id: targetSpecies.id })
        .eq('user_id', userId);
    } catch (_updateErr) {
      console.warn('[Active Spirit DB Update Warn]', _updateErr.message);
    }

    // Update in-memory fallback state
    fbState.active_species = targetAttr;
    fbState.unlocked_species.add(targetAttr);

    const currentStageNum = getStageFromLevel(userLevel);
    const stages = FALLBACK_STAGES[targetAttr] || [];
    const activeStage = stages.find((s) => s.stage_number === currentStageNum) || stages[0];

    return res.status(200).json({
      success: true,
      message: `Attuned with ${targetSpecies.name}!`,
      active_species: {
        id: targetSpecies.id || `species-${targetAttr}`,
        name: targetSpecies.name,
        attribute_type: targetAttr,
        current_stage: activeStage
      }
    });

  } catch (err) {
    console.error('[Patch Active Spirit Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

/**
 * POST /api/spirit/greet
 * Records a greeting interaction. Server-side cooldown: 4 hours.
 * Rejects with HTTP 429 if user already greeted within 4 hours.
 * Returns one of several rotating flavor-text lines matching active species' personality.
 */
router.post('/greet', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const client = getClient();

    // 1. Fetch character & spirit record
    const { data: character } = await client
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const dominantAttr = determineHighestAttribute(character);
    const fbState = getOrCreateFallbackState(userId, dominantAttr);

    let userSpirit = null;
    let activeSpeciesData = null;

    try {
      const { data: sRow } = await client
        .from('user_spirits')
        .select('*, active_species:spirit_species!user_spirits_active_species_id_fkey(*), species:spirit_species(*)')
        .eq('user_id', userId)
        .maybeSingle();

      if (sRow) {
        userSpirit = sRow;
        activeSpeciesData = sRow.active_species || sRow.species;
      }
    } catch (_e) {
      try {
        const { data: simpleRow } = await client
          .from('user_spirits')
          .select('*, species:spirit_species(*)')
          .eq('user_id', userId)
          .maybeSingle();
        if (simpleRow) {
          userSpirit = simpleRow;
          activeSpeciesData = simpleRow.species;
        }
      } catch (_sErr) {}
    }

    const activeAttr = activeSpeciesData?.attribute_type || fbState.active_species || dominantAttr;
    const activeCatalog = FALLBACK_SPECIES[activeAttr] || FALLBACK_SPECIES.focus;

    // 2. Check 4-hour cooldown
    const lastGreetedAt = userSpirit?.last_greeted_at || fbState.last_greeted_at;
    if (lastGreetedAt) {
      const elapsed = Date.now() - new Date(lastGreetedAt).getTime();
      if (elapsed < GREETING_COOLDOWN_MS) {
        const remainingMs = GREETING_COOLDOWN_MS - elapsed;
        return res.status(429).json({
          status: 'cooldown',
          message: 'Your spirit is quietly recharging its celestial energy.',
          resting_line: activeCatalog.resting_line,
          cooldown_remaining_ms: remainingMs,
          cooldown_remaining_formatted: formatCooldown(remainingMs),
          species_name: activeCatalog.name
        });
      }
    }

    // 3. Cooldown expired or first greeting: record new interaction timestamp
    const nowIso = new Date().toISOString();
    fbState.last_greeted_at = nowIso;

    try {
      await client
        .from('user_spirits')
        .update({ last_greeted_at: nowIso })
        .eq('user_id', userId);
    } catch (_uErr) {
      console.warn('[Spirit Greet Timestamp Warn]', _uErr.message);
    }

    // 4. Select rotating personality flavor line (4-5 lines per species)
    const lines = activeCatalog.personality_lines || [];
    const randomIndex = Math.floor(Math.random() * lines.length);
    const chosenFlavorLine = lines[randomIndex];

    return res.status(200).json({
      success: true,
      flavor_line: chosenFlavorLine,
      species_name: activeCatalog.name,
      animation: 'sparkle_bounce',
      cooldown_hours: 4,
      last_greeted_at: nowIso
    });

  } catch (err) {
    console.error('[Post Spirit Greet Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

export default router;
