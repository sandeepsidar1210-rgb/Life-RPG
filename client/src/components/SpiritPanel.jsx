import React, { useState, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { SpiritCompanion } from './MyRoom/SpiritModels.jsx';

/**
 * All 4 Spirit Species & Stage Catalog for the Spirit Compendium
 */
export const ALL_SPECIES_CATALOG = [
  {
    code: 'emberwisp',
    name: 'Emberwisp',
    attribute_type: 'focus',
    title: 'Focus Spirit',
    icon: '🔥',
    lore_description:
      'Born from the glowing embers of study hearths and candlelit tomes. Emberwisps thrive in moments of deep, unbroken concentration and illuminate late-night revisions.',
    resonance_trait: 'Awakened by unbroken study sprints, deep reading sessions, and morning tea.',
    stages: [
      {
        stage_number: 1,
        name: 'Emberwisp Spark',
        unlock_level: 1,
        description: 'A tiny steam-and-ember wisp glowing with soft golden light, bobbing inquisitively as you study.',
        model_key: 'emberwisp_stage_1'
      },
      {
        stage_number: 2,
        name: 'Emberwisp Lantern',
        unlock_level: 5,
        description: 'A crystallized brass-caged lantern wisp with flickering flame winglets and dancing ember motes.',
        model_key: 'emberwisp_stage_2'
      },
      {
        stage_number: 3,
        name: 'Emberwisp Pyrespirit',
        unlock_level: 12,
        description: 'A celestial hearth dragonling radiating brilliant golden warmth and trailing stellar flame ribbons.',
        model_key: 'emberwisp_stage_3'
      }
    ]
  },
  {
    code: 'rootling',
    name: 'Rootling',
    attribute_type: 'discipline',
    title: 'Discipline Spirit',
    icon: '🛡️',
    lore_description:
      'Formed from ancient moss-clad river stones and patient roots. Rootlings embody steadfast resolve, unshakeable habit, and the quiet power of steady practice.',
    resonance_trait: 'Thrives on daily streaks, structured timetables, and persistent daily reviews.',
    stages: [
      {
        stage_number: 1,
        name: 'Rootling Pebble',
        unlock_level: 1,
        description: 'A shy, rounded river pebble spirit with soft moss patches and two bright curious stone eyes.',
        model_key: 'rootling_stage_1'
      },
      {
        stage_number: 2,
        name: 'Rootling Runeguard',
        unlock_level: 5,
        description: 'A sturdy stone sentinel bound with glowing turquoise runic inlays, woody roots, and alpine flora.',
        model_key: 'rootling_stage_2'
      },
      {
        stage_number: 3,
        name: 'Rootling Colossus',
        unlock_level: 12,
        description: 'An ancient moss golem crowned with a weathered stone lantern shrine and orbiting runic stones.',
        model_key: 'rootling_stage_3'
      }
    ]
  },
  {
    code: 'sproutling',
    name: 'Sproutling',
    attribute_type: 'vitality',
    title: 'Vitality Spirit',
    icon: '🌱',
    lore_description:
      'Awoken by morning dew and crisp mountain air. Sproutlings pulse with rejuvenating life energy, encouraging scholars to stretch, breathe, and flourish.',
    resonance_trait: 'Energized by wellness habits, mindful study breaks, fresh air, and hydration.',
    stages: [
      {
        stage_number: 1,
        name: 'Sproutling Seed',
        unlock_level: 1,
        description: 'A cheerful acorn-capped seed sprite with a fluttering twin clover sprout that spins when excited.',
        model_key: 'sproutling_stage_1'
      },
      {
        stage_number: 2,
        name: 'Sproutling Bloom',
        unlock_level: 5,
        description: 'An energetic flower-nymph wrapped in living ivy vines with fragrant blooming cherry blossoms.',
        model_key: 'sproutling_stage_2'
      },
      {
        stage_number: 3,
        name: 'Sproutling Dryad',
        unlock_level: 12,
        description: 'A breathtaking herald of vitality woven of blooming sakura wood with branch antlers and petal halos.',
        model_key: 'sproutling_stage_3'
      }
    ]
  },
  {
    code: 'inkling',
    name: 'Inkling',
    attribute_type: 'creativity',
    title: 'Creativity Spirit',
    icon: '✨',
    lore_description:
      'Born from fountain pen swirls on fresh parchment and midnight starlight. Inklings inspire sudden artistic epiphanies, poetic verses, and boundless imagination.',
    resonance_trait: 'Inspired by exploratory writing, novel problem solving, drawing, and brainstorming.',
    stages: [
      {
        stage_number: 1,
        name: 'Inkling Droplet',
        unlock_level: 1,
        description: 'A glossy deep indigo ink drop with starlight flecks and a quill tail, floating playfully above your papers.',
        model_key: 'inkling_stage_1'
      },
      {
        stage_number: 2,
        name: 'Inkling Quillwing',
        unlock_level: 5,
        description: 'A calligraphic origami ink bird with sharp feather plumage, trailing ink ribbons, and star-charted wings.',
        model_key: 'inkling_stage_2'
      },
      {
        stage_number: 3,
        name: 'Inkling Leviathan',
        unlock_level: 12,
        description: 'A cosmic astral ink wyrm composed of deep indigo nebula ink, golden calligraphy horns, and blazing starlight rings.',
        model_key: 'inkling_stage_3'
      }
    ]
  }
];

// Helper to determine color theme by attribute
export const getAttrTheme = (attr = 'focus') => {
  switch (attr.toLowerCase()) {
    case 'discipline':
      return {
        title: 'Discipline',
        icon: '🛡️',
        color: 'text-emerald-800',
        bgColor: 'bg-emerald-100',
        borderColor: 'border-emerald-600',
        bannerBg: 'bg-gradient-to-r from-emerald-800 to-teal-900',
        lightColor: '#A7F3D0'
      };
    case 'vitality':
      return {
        title: 'Vitality',
        icon: '🌱',
        color: 'text-rose-800',
        bgColor: 'bg-rose-100',
        borderColor: 'border-rose-600',
        bannerBg: 'bg-gradient-to-r from-rose-800 to-amber-900',
        lightColor: '#FECDD3'
      };
    case 'creativity':
      return {
        title: 'Creativity',
        icon: '✨',
        color: 'text-indigo-800',
        bgColor: 'bg-indigo-100',
        borderColor: 'border-indigo-600',
        bannerBg: 'bg-gradient-to-r from-indigo-900 to-violet-950',
        lightColor: '#C7D2FE'
      };
    default:
      return {
        title: 'Focus',
        icon: '🔥',
        color: 'text-amber-800',
        bgColor: 'bg-amber-100',
        borderColor: 'border-amber-600',
        bannerBg: 'bg-gradient-to-r from-amber-700 to-orange-900',
        lightColor: '#FDE68A'
      };
  }
};

/**
 * SpiritPanel
 * Dedicated "My Spirit" sanctuary view with:
 * 1. "My Bonded Spirit" view: 360° 3D inspection, interactive previous & next evolution previews, roadmap, and nickname editor.
 * 2. "Spirit Compendium" view: Interactive bestiary to inspect all 4 spirit species across all 12 stages in 3D.
 */
export function SpiritPanel({
  spiritData = null,
  userLevel = 1,
  onNavigateToQuests
}) {
  const controlsRef = useRef();
  const compendiumControlsRef = useRef();

  // Top view tab: 'my_spirit' or 'compendium'
  const [activeView, setActiveView] = useState('my_spirit');

  // Extract bonded spirit properties
  const species = useMemo(() => {
    return spiritData?.species || {
      name: 'Emberwisp',
      attribute_type: 'focus',
      lore_description:
        'Born from the glowing embers of study hearths and candlelit tomes. Emberwisps thrive in moments of deep, unbroken concentration and illuminate late-night revisions.'
    };
  }, [spiritData]);

  const currentStage = useMemo(() => {
    return (
      spiritData?.current_stage || {
        stage_number: userLevel >= 12 ? 3 : userLevel >= 5 ? 2 : 1,
        name: userLevel >= 12 ? 'Emberwisp Pyrespirit' : userLevel >= 5 ? 'Emberwisp Lantern' : 'Emberwisp Spark',
        description: 'A tiny steam-and-ember wisp glowing with soft golden light, bobbing inquisitively as you study.',
        unlock_level: 1,
        model_key: 'emberwisp_stage_1'
      }
    );
  }, [spiritData, userLevel]);

  const currentStageNum = currentStage?.stage_number || spiritData?.spirit?.current_stage || 1;

  // Selected stage for 3D inspection (defaults to active stage, but scholar can freely inspect Stage 1, 2, or 3)
  const [inspectedStageNum, setInspectedStageNum] = useState(currentStageNum);

  // All 3 stages of user's species
  const allStages = useMemo(() => {
    const catalogEntry = ALL_SPECIES_CATALOG.find((c) => c.attribute_type === species.attribute_type) || ALL_SPECIES_CATALOG[0];
    return catalogEntry.stages.map((stg) => ({
      ...stg,
      is_unlocked: userLevel >= stg.unlock_level,
      is_current: stg.stage_number === currentStageNum
    }));
  }, [species.attribute_type, userLevel, currentStageNum]);

  // Stage currently being inspected
  const inspectedStage = useMemo(() => {
    return allStages.find((s) => s.stage_number === inspectedStageNum) || allStages[0];
  }, [allStages, inspectedStageNum]);

  // Next evolution teaser calculation
  const nextStage = useMemo(() => {
    return currentStageNum < 3 ? allStages.find((s) => s.stage_number === currentStageNum + 1) : null;
  }, [allStages, currentStageNum]);
  const levelsRemaining = nextStage ? Math.max(0, nextStage.unlock_level - userLevel) : 0;

  // Nickname feature (persisted in localStorage)
  const defaultName = species?.name || 'Study Spirit';
  const [nickname, setNickname] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('life_rpg_spirit_nickname') || defaultName;
      } catch (_err) {
        return defaultName;
      }
    }
    return defaultName;
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(nickname);

  const handleSaveNickname = (e) => {
    e.preventDefault();
    const clean = nameInput.trim() || defaultName;
    setNickname(clean);
    setIsEditingName(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('life_rpg_spirit_nickname', clean);
      } catch (_err) {}
    }
  };

  // Reset 3D camera
  const handleResetCamera = () => {
    if (controlsRef.current) controlsRef.current.reset();
  };

  const handleResetCompendiumCamera = () => {
    if (compendiumControlsRef.current) compendiumControlsRef.current.reset();
  };

  // Model key for active 3D view
  const activeInspectionModelKey = useMemo(() => {
    if (inspectedStage?.model_key) return inspectedStage.model_key;
    const attr = species?.attribute_type || 'focus';
    const prefix = attr === 'discipline' ? 'rootling' : attr === 'vitality' ? 'sproutling' : attr === 'creativity' ? 'inkling' : 'emberwisp';
    return `${prefix}_stage_${inspectedStageNum}`;
  }, [inspectedStage, species, inspectedStageNum]);

  // Bonded attribute theme
  const attrTheme = useMemo(() => getAttrTheme(species?.attribute_type || 'focus'), [species.attribute_type]);

  // =========================================================================
  // Compendium State (All 4 Species Preview)
  // =========================================================================
  const [selectedCompendiumCode, setSelectedCompendiumCode] = useState('emberwisp');
  const [selectedCompendiumStage, setSelectedCompendiumStage] = useState(1);

  const compendiumSpecies = useMemo(() => {
    return ALL_SPECIES_CATALOG.find((c) => c.code === selectedCompendiumCode) || ALL_SPECIES_CATALOG[0];
  }, [selectedCompendiumCode]);

  const compendiumStage = useMemo(() => {
    return compendiumSpecies.stages.find((s) => s.stage_number === selectedCompendiumStage) || compendiumSpecies.stages[0];
  }, [compendiumSpecies, selectedCompendiumStage]);

  const compendiumTheme = useMemo(() => getAttrTheme(compendiumSpecies.attribute_type), [compendiumSpecies.attribute_type]);

  return (
    <section aria-labelledby="spirit-sanctuary-heading" className="space-y-6">
      {/* Top Banner Header with View Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-cozy-brown-dark pb-3">
        <div>
          <h2 id="spirit-sanctuary-heading" className="text-xl sm:text-2xl font-pixel text-cozy-brown-dark flex items-center gap-2">
            <span aria-hidden="true">✨</span> Study Spirits Sanctuary
          </h2>
          <p className="text-xs text-cozy-brown-medium">
            Permanent celestial companion bonded to your {attrTheme.title} attribute • Evolves through 3 stages
          </p>
        </div>

        {/* View Switcher: My Bonded Spirit vs Spirit Compendium */}
        <div className="flex items-center gap-2 bg-cozy-parchment p-1 rounded-pixel border-2 border-cozy-border">
          <button
            type="button"
            onClick={() => setActiveView('my_spirit')}
            className={`touch-target px-3 py-1.5 rounded-pixel font-pixel text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'my_spirit'
                ? 'bg-cozy-card text-cozy-brown-dark shadow-pixel-xs border-2 border-cozy-brown-dark'
                : 'text-cozy-brown-medium hover:text-cozy-brown-dark'
            }`}
          >
            <span>🌟</span>
            <span>My Spirit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('compendium')}
            className={`touch-target px-3 py-1.5 rounded-pixel font-pixel text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'compendium'
                ? 'bg-cozy-card text-cozy-brown-dark shadow-pixel-xs border-2 border-cozy-brown-dark'
                : 'text-cozy-brown-medium hover:text-cozy-brown-dark'
            }`}
          >
            <span>📖</span>
            <span>All Spirits Compendium</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* VIEW 1: MY BONDED SPIRIT (Interactive Previous & Next Stage Previews)   */}
        {/* ========================================================================= */}
        {activeView === 'my_spirit' ? (
          <motion.div
            key="my_spirit"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {/* Main Grid: 3D Viewport on Left, Lore & Next Evolution on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: 3D Inspection Canvas with Stage Selector Pills */}
              <div className="lg:col-span-7 xl:col-span-7 space-y-4">
                <div className="relative rounded-pixel overflow-hidden bg-gradient-to-b from-cozy-parchment to-cozy-card border-2 border-cozy-brown-dark shadow-pixel h-[390px] sm:h-[450px] select-none">
                  {/* 3D Canvas */}
                  <Canvas
                    tabIndex={-1}
                    dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
                    camera={{ position: [0, 0.5, 2.5], fov: 45 }}
                    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                  >
                    <ambientLight intensity={1.1} />
                    <directionalLight position={[4, 5, 4]} intensity={1.2} color="#FFFBF0" />
                    <directionalLight position={[-4, 2, -2]} intensity={0.6} color={attrTheme.lightColor} />
                    <pointLight position={[0, -0.5, 0]} intensity={0.4} color="#FFF" />

                    <SpiritCompanion modelKey={activeInspectionModelKey} isPreview={true} />

                    <OrbitControls
                      ref={controlsRef}
                      makeDefault={true}
                      enablePan={false}
                      minDistance={1.4}
                      maxDistance={4.2}
                      minPolarAngle={Math.PI / 6}
                      maxPolarAngle={Math.PI / 1.8}
                      enableDamping={true}
                      dampingFactor={0.07}
                    />
                  </Canvas>

                  {/* Top HUD: Current View Tag & Reset Camera */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 bg-cozy-card/90 backdrop-blur-sm text-cozy-brown-dark text-[11px] font-pixel rounded border border-cozy-brown-light/60 shadow-pixel-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cozy-sage animate-ping" aria-hidden="true" />
                      <span>360° Spirit Inspection</span>
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={handleResetCamera}
                      title="Reset Inspection Camera"
                      aria-label="Reset Camera View to Default"
                      className="touch-target px-3 py-1.5 bg-cozy-card hover:bg-cozy-parchment text-cozy-brown-dark text-xs font-pixel rounded border-2 border-cozy-brown-dark shadow-pixel-sm transition active:scale-95 focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
                    >
                      <span>🎯 Reset View</span>
                    </button>
                  </div>

                  {/* Dynamic Stage Banner (Alerts if viewing prior or future preview) */}
                  <div className="absolute top-12 left-3 right-3 z-10 pointer-events-none">
                    <div className="flex items-center justify-between gap-2">
                      {inspectedStageNum === currentStageNum ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cozy-terracotta text-white font-pixel text-[11px] shadow-pixel-xs">
                          <span>✨</span> Active Form in Sanctuary
                        </span>
                      ) : inspectedStageNum < currentStageNum ? (
                        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1 rounded-full bg-amber-700 text-white font-pixel text-[11px] shadow-pixel-xs">
                          <span>⏪ Prior Evolution (Mastered at Lv. {inspectedStage.unlock_level})</span>
                          <button
                            type="button"
                            onClick={() => setInspectedStageNum(currentStageNum)}
                            className="underline font-bold text-amber-200 hover:text-white ml-1"
                          >
                            Return to Active
                          </button>
                        </div>
                      ) : (
                        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800 text-white font-pixel text-[11px] shadow-pixel-xs">
                          <span>🔮 Future Evolution Preview (Unlocks at Lv. {inspectedStage.unlock_level})</span>
                          <button
                            type="button"
                            onClick={() => setInspectedStageNum(currentStageNum)}
                            className="underline font-bold text-purple-200 hover:text-white ml-1"
                          >
                            Return to Active
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Evolution Stage Switcher Bar (Directly within Viewport) */}
                  <div className="absolute bottom-11 left-3 right-3 z-10 flex items-center justify-center gap-2">
                    <div className="bg-cozy-card/95 backdrop-blur-md px-3 py-1.5 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel flex items-center gap-1.5 flex-wrap justify-center">
                      <span className="text-[10px] font-pixel text-cozy-brown-medium mr-1 hidden sm:inline">Preview Stage:</span>
                      {allStages.map((stg) => {
                        const isSelected = stg.stage_number === inspectedStageNum;
                        const isCurrentActive = stg.stage_number === currentStageNum;

                        return (
                          <button
                            key={stg.stage_number}
                            type="button"
                            onClick={() => setInspectedStageNum(stg.stage_number)}
                            className={`touch-target px-2.5 py-1 rounded font-pixel text-[11px] font-bold transition flex items-center gap-1 ${
                              isSelected
                                ? 'bg-cozy-terracotta text-white shadow-sm ring-2 ring-cozy-terracotta-dark'
                                : 'bg-cozy-parchment hover:bg-cozy-border text-cozy-brown-dark'
                            }`}
                          >
                            <span>{stg.stage_number === 1 ? 'Form I' : stg.stage_number === 2 ? 'Form II' : 'Form III'}</span>
                            {isCurrentActive && <span className="text-[9px] opacity-90">(Active)</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hint Overlay */}
                  <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none px-4">
                    <span className="inline-block px-3 py-1 bg-cozy-card/90 backdrop-blur-sm text-cozy-brown-medium text-[10px] font-pixel rounded-full border border-cozy-border shadow-sm">
                      🖱️ Drag to orbit around {inspectedStage.name} • Scroll to zoom
                    </span>
                  </div>
                </div>

                {/* Name Plate & Personalization */}
                <div className="pixel-box bg-cozy-card p-4 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden="true">✨</span>
                      {isEditingName ? (
                        <form onSubmit={handleSaveNickname} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            maxLength={24}
                            className="px-2 py-1 text-sm font-pixel font-bold rounded border-2 border-cozy-brown-dark bg-white text-cozy-brown-dark focus:outline-none focus:ring-2 focus:ring-cozy-sage"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="touch-target px-2.5 py-1 text-xs font-pixel font-bold bg-cozy-sage text-white rounded hover:bg-cozy-sage-dark shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingName(false)}
                            className="touch-target px-2 py-1 text-xs font-pixel text-cozy-brown-medium hover:text-cozy-brown-dark"
                          >
                            ✕
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-pixel font-bold text-cozy-brown-dark">
                            {nickname}
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              setNameInput(nickname);
                              setIsEditingName(true);
                            }}
                            title="Give your spirit a nickname"
                            className="touch-target text-xs text-cozy-brown-medium hover:text-cozy-terracotta transition p-1"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-cozy-brown-medium">
                      Inspecting: <span className="font-bold text-cozy-brown-dark">{inspectedStage.name}</span> (Stage {inspectedStageNum}/3) • {species.name} Species
                    </p>
                  </div>

                  <div className="text-right text-xs font-pixel text-cozy-brown-medium">
                    <span>Scholar Level: </span>
                    <span className="text-cozy-terracotta-dark font-bold text-sm">{userLevel}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Species Lore & Next Evolution Teaser */}
              <div className="lg:col-span-5 xl:col-span-5 space-y-4">
                {/* Next Evolution Teaser Card */}
                <div
                  className={`pixel-box p-5 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel relative overflow-hidden ${
                    currentStageNum >= 3
                      ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white'
                      : 'bg-cozy-card text-cozy-brown-dark'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-pixel uppercase tracking-wider font-bold opacity-80">
                      {currentStageNum >= 3 ? '🌟 Pinnacle Attained' : '🔮 Evolution Horizon'}
                    </span>
                    <span className="text-xs font-pixel px-2 py-0.5 rounded-full bg-cozy-brown-dark/10 font-bold">
                      {currentStageNum >= 3 ? 'Cosmic Bond' : `Target: Level ${nextStage?.unlock_level || 5}`}
                    </span>
                  </div>

                  {currentStageNum >= 3 ? (
                    <div className="space-y-2 pt-1">
                      <h4 className="text-lg font-pixel font-bold text-amber-300 flex items-center gap-2">
                        <span>🌌</span> Astral Bond Mastered
                      </h4>
                      <p className="text-xs leading-relaxed text-indigo-100">
                        Your spirit has reached its ultimate celestial manifestation! Bound permanently to your study journey, it roams freely across all sanctuary chambers you unlock.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div>
                        <h4 className="text-base font-pixel font-bold text-cozy-terracotta-dark">
                          Next Evolution: Level {nextStage?.unlock_level}
                        </h4>
                        <p className="text-xs text-cozy-brown-medium mt-0.5">
                          {nextStage?.name || `Form ${currentStageNum + 1}`}
                        </p>
                      </div>

                      {/* Progress bar towards next evolution */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-pixel text-cozy-brown-medium">
                          <span>Current: Lv. {userLevel}</span>
                          <span className="text-cozy-terracotta font-bold">
                            {levelsRemaining === 0 ? 'Ready to evolve!' : `${levelsRemaining} ${levelsRemaining === 1 ? 'level' : 'levels'} remaining`}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-cozy-parchment rounded-full border border-cozy-brown-dark/40 overflow-hidden p-0.5">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-cozy-terracotta rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(10, ((userLevel - (currentStageNum === 1 ? 1 : 5)) / ((nextStage?.unlock_level || 5) - (currentStageNum === 1 ? 1 : 5))) * 100)
                              )}%`
                            }}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-cozy-brown-dark leading-relaxed italic bg-cozy-parchment/60 p-2.5 rounded border border-cozy-border">
                        "{nextStage?.description || 'A greater metamorphosis awaits when your concentration deepens further.'}"
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setInspectedStageNum(nextStage?.stage_number || 2)}
                          className="flex-1 touch-target pixel-box-interactive bg-cozy-parchment hover:bg-cozy-border text-cozy-brown-dark font-pixel text-xs py-2 px-3 rounded font-bold border border-cozy-brown-dark shadow-pixel-xs transition flex items-center justify-center gap-1.5"
                        >
                          <span>🔮 3D Preview Next Form</span>
                        </button>

                        {onNavigateToQuests && (
                          <button
                            type="button"
                            onClick={onNavigateToQuests}
                            className="touch-target pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel text-xs py-2 px-3 rounded font-bold shadow-pixel-xs transition flex items-center justify-center gap-1.5"
                          >
                            <span>📜 Quests</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Species Lore Card */}
                <div className="pixel-box bg-cozy-card p-5 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel-sm space-y-3">
                  <h4 className="text-sm font-pixel font-bold text-cozy-brown-dark flex items-center gap-2 border-b border-cozy-border pb-2">
                    <span>📖</span> Species Lore &amp; Nature
                  </h4>
                  <p className="text-xs text-cozy-brown-dark leading-relaxed">
                    {species.lore_description}
                  </p>
                  <div className="pixel-box bg-cozy-parchment p-3 rounded text-[11px] text-cozy-brown-medium space-y-1">
                    <span className="font-bold text-cozy-brown-dark block">⚡ Resonance Trait:</span>
                    <span>
                      Earns resonance whenever you complete {attrTheme.title}-aligned study quests. Your companion wanders freely across all 3D chambers you unlock.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Evolution Stage Roadmap (Click any card to preview in 3D) */}
            <div className="pixel-box bg-cozy-card p-6 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cozy-border pb-3">
                <div>
                  <h3 className="text-base font-pixel font-bold text-cozy-brown-dark flex items-center gap-2">
                    <span>🌱</span> Evolution Stage Roadmap
                  </h3>
                  <p className="text-xs text-cozy-brown-medium">
                    Click any stage card below to inspect its 3D model, lore, and metamorphosis in the 3D viewport
                  </p>
                </div>
                <div className="text-xs font-pixel text-cozy-brown-medium">
                  Stage 1: Lv. 1 • Stage 2: Lv. 5 • Stage 3: Lv. 12
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {allStages.map((stg) => {
                  const isUnlocked = userLevel >= stg.unlock_level;
                  const isCurrent = stg.stage_number === currentStageNum;
                  const isInspecting = stg.stage_number === inspectedStageNum;

                  return (
                    <motion.div
                      key={stg.stage_number}
                      whileHover={{ y: -3 }}
                      onClick={() => setInspectedStageNum(stg.stage_number)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setInspectedStageNum(stg.stage_number);
                        }
                      }}
                      className={`pixel-box p-4 rounded-pixel border-2 transition relative flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-cozy-terracotta ${
                        isInspecting
                          ? 'border-cozy-terracotta-dark bg-cozy-parchment shadow-pixel ring-2 ring-cozy-terracotta'
                          : isCurrent
                          ? 'border-cozy-terracotta bg-cozy-parchment/80 shadow-pixel-xs'
                          : isUnlocked
                          ? 'border-cozy-sage bg-cozy-card shadow-pixel-xs hover:border-cozy-sage-dark'
                          : 'border-cozy-border/80 bg-cozy-parchment/40 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-pixel px-2 py-0.5 rounded-full font-bold uppercase ${
                              isCurrent
                                ? 'bg-cozy-terracotta text-white'
                                : isUnlocked
                                ? 'bg-cozy-sage text-white'
                                : 'bg-cozy-border text-cozy-brown-medium'
                            }`}
                          >
                            Stage {stg.stage_number}
                          </span>

                          <span className="text-xs font-pixel">
                            {isCurrent ? (
                              <span className="text-cozy-terracotta-dark font-bold flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-cozy-terracotta animate-ping" />
                                Active Form
                              </span>
                            ) : isUnlocked ? (
                              <span className="text-cozy-sage-dark font-bold">✓ Mastered</span>
                            ) : (
                              <span className="text-cozy-brown-medium">🔒 Level {stg.unlock_level}</span>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-pixel font-bold text-cozy-brown-dark">
                            {stg.name}
                          </h4>
                          {isInspecting && (
                            <span className="text-[10px] font-pixel bg-cozy-terracotta text-white px-2 py-0.5 rounded-full font-bold shadow-xs">
                              👀 In 3D
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-cozy-brown-medium leading-relaxed">
                          {stg.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-cozy-border/60 flex items-center justify-between text-[11px] font-pixel text-cozy-brown-medium">
                        <span>Requirement:</span>
                        <span className={isUnlocked ? 'text-cozy-sage-dark font-bold' : 'text-cozy-brown-dark font-bold'}>
                          Level {stg.unlock_level}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: SPIRIT COMPENDIUM (Inspect All 4 Species Across All 12 Stages)    */
          /* ========================================================================= */
          <motion.div
            key="compendium"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {/* Species Selector Grid (All 4 Species) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ALL_SPECIES_CATALOG.map((item) => {
                const isSelected = item.code === selectedCompendiumCode;
                const isBonded = item.attribute_type === species.attribute_type;
                const theme = getAttrTheme(item.attribute_type);

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setSelectedCompendiumCode(item.code);
                      setSelectedCompendiumStage(1);
                    }}
                    className={`touch-target pixel-box p-3.5 rounded-pixel border-2 text-left transition relative flex flex-col justify-between gap-2 focus:outline-none ${
                      isSelected
                        ? 'border-cozy-brown-dark bg-cozy-card shadow-pixel ring-2 ring-cozy-brown-dark'
                        : 'border-cozy-border bg-cozy-parchment/60 hover:bg-cozy-card shadow-pixel-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xl">{item.icon}</span>
                        {isBonded && (
                          <span className="text-[9px] font-pixel px-2 py-0.5 rounded-full bg-cozy-terracotta text-white font-bold">
                            Bonded
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-pixel font-bold text-cozy-brown-dark">
                        {item.name}
                      </h4>
                      <p className={`text-[11px] font-pixel font-bold ${theme.color}`}>
                        {item.title}
                      </p>
                    </div>

                    <div className="text-[10px] font-pixel text-cozy-brown-medium pt-1 border-t border-cozy-border/50 flex items-center justify-between">
                      <span>3 Stages</span>
                      <span className="text-cozy-brown-dark font-bold">Inspect ➔</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main Inspection Area for Selected Compendium Species */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 3D Viewport */}
              <div className="lg:col-span-7 xl:col-span-7 space-y-4">
                <div className="relative rounded-pixel overflow-hidden bg-gradient-to-b from-cozy-parchment to-cozy-card border-2 border-cozy-brown-dark shadow-pixel h-[390px] sm:h-[450px] select-none">
                  <Canvas
                    tabIndex={-1}
                    dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
                    camera={{ position: [0, 0.5, 2.5], fov: 45 }}
                    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                  >
                    <ambientLight intensity={1.1} />
                    <directionalLight position={[4, 5, 4]} intensity={1.2} color="#FFFBF0" />
                    <directionalLight position={[-4, 2, -2]} intensity={0.6} color={compendiumTheme.lightColor} />
                    <pointLight position={[0, -0.5, 0]} intensity={0.4} color="#FFF" />

                    <SpiritCompanion modelKey={compendiumStage.model_key} isPreview={true} />

                    <OrbitControls
                      ref={compendiumControlsRef}
                      makeDefault={true}
                      enablePan={false}
                      minDistance={1.4}
                      maxDistance={4.2}
                      minPolarAngle={Math.PI / 6}
                      maxPolarAngle={Math.PI / 1.8}
                      enableDamping={true}
                      dampingFactor={0.07}
                    />
                  </Canvas>

                  {/* HUD Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 bg-cozy-card/90 backdrop-blur-sm text-cozy-brown-dark text-[11px] font-pixel rounded border border-cozy-brown-light/60 shadow-pixel-sm flex items-center gap-1.5">
                      <span>{compendiumTheme.icon}</span>
                      <span>Compendium: {compendiumSpecies.name}</span>
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={handleResetCompendiumCamera}
                      title="Reset Inspection Camera"
                      className="touch-target px-3 py-1.5 bg-cozy-card hover:bg-cozy-parchment text-cozy-brown-dark text-xs font-pixel rounded border-2 border-cozy-brown-dark shadow-pixel-sm transition active:scale-95"
                    >
                      <span>🎯 Reset View</span>
                    </button>
                  </div>

                  {/* Stage Switcher Pills */}
                  <div className="absolute bottom-11 left-3 right-3 z-10 flex items-center justify-center gap-2">
                    <div className="bg-cozy-card/95 backdrop-blur-md px-3 py-1.5 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel flex items-center gap-1.5 flex-wrap justify-center">
                      <span className="text-[10px] font-pixel text-cozy-brown-medium mr-1 hidden sm:inline">Evolution Stage:</span>
                      {compendiumSpecies.stages.map((stg) => {
                        const isSelected = stg.stage_number === selectedCompendiumStage;

                        return (
                          <button
                            key={stg.stage_number}
                            type="button"
                            onClick={() => setSelectedCompendiumStage(stg.stage_number)}
                            className={`touch-target px-2.5 py-1 rounded font-pixel text-[11px] font-bold transition flex items-center gap-1 ${
                              isSelected
                                ? 'bg-cozy-terracotta text-white shadow-sm ring-2 ring-cozy-terracotta-dark'
                                : 'bg-cozy-parchment hover:bg-cozy-border text-cozy-brown-dark'
                            }`}
                          >
                            <span>Stage {stg.stage_number}</span>
                            <span className="text-[9px] opacity-80">(Lv. {stg.unlock_level})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hint Overlay */}
                  <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none px-4">
                    <span className="inline-block px-3 py-1 bg-cozy-card/90 backdrop-blur-sm text-cozy-brown-medium text-[10px] font-pixel rounded-full border border-cozy-border shadow-sm">
                      🖱️ Drag to orbit around {compendiumStage.name} • Scroll to zoom
                    </span>
                  </div>
                </div>

                {/* Name & Stage Tag */}
                <div className="pixel-box bg-cozy-card p-4 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-pixel font-bold text-cozy-brown-dark flex items-center gap-2">
                      <span>{compendiumSpecies.icon}</span>
                      <span>{compendiumStage.name}</span>
                    </h3>
                    <p className="text-xs text-cozy-brown-medium">
                      Stage {selectedCompendiumStage} of 3 • {compendiumSpecies.name} ({compendiumTheme.title} Affinity)
                    </p>
                  </div>
                  <span className="text-xs font-pixel px-3 py-1.5 rounded-pixel bg-cozy-parchment border border-cozy-brown-dark font-bold text-cozy-brown-dark">
                    Unlocks at Lv. {compendiumStage.unlock_level}
                  </span>
                </div>
              </div>

              {/* Lore & Details */}
              <div className="lg:col-span-5 xl:col-span-5 space-y-4">
                <div className="pixel-box bg-cozy-card p-5 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel space-y-3">
                  <div className="flex items-center justify-between border-b border-cozy-border pb-2">
                    <h4 className="text-sm font-pixel font-bold text-cozy-brown-dark flex items-center gap-2">
                      <span>{compendiumSpecies.icon}</span>
                      <span>{compendiumSpecies.name} Lore</span>
                    </h4>
                    <span className={`text-[10px] font-pixel px-2 py-0.5 rounded-full font-bold ${compendiumTheme.bgColor} ${compendiumTheme.color}`}>
                      {compendiumTheme.title}
                    </span>
                  </div>

                  <p className="text-xs text-cozy-brown-dark leading-relaxed">
                    {compendiumSpecies.lore_description}
                  </p>

                  <div className="pixel-box bg-cozy-parchment p-3 rounded text-[11px] text-cozy-brown-medium space-y-1">
                    <span className="font-bold text-cozy-brown-dark block">⚡ Resonance Trait:</span>
                    <span>{compendiumSpecies.resonance_trait}</span>
                  </div>
                </div>

                {/* Evolution Stages Showcase for this Species */}
                <div className="pixel-box bg-cozy-card p-5 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel space-y-3">
                  <h4 className="text-xs font-pixel uppercase tracking-wider font-bold text-cozy-brown-dark">
                    Evolutionary Forms
                  </h4>

                  <div className="space-y-2">
                    {compendiumSpecies.stages.map((stg) => {
                      const isSelected = stg.stage_number === selectedCompendiumStage;

                      return (
                        <div
                          key={stg.stage_number}
                          onClick={() => setSelectedCompendiumStage(stg.stage_number)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedCompendiumStage(stg.stage_number);
                            }
                          }}
                          className={`p-3 rounded-pixel border-2 transition cursor-pointer flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'border-cozy-terracotta-dark bg-cozy-parchment shadow-pixel-xs ring-1 ring-cozy-terracotta'
                              : 'border-cozy-border bg-cozy-card hover:bg-cozy-parchment/60'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-pixel font-bold text-cozy-brown-dark">
                                {stg.name}
                              </span>
                              <span className="text-[10px] font-pixel text-cozy-brown-medium">
                                (Lv. {stg.unlock_level})
                              </span>
                            </div>
                            <p className="text-[11px] text-cozy-brown-medium line-clamp-2">
                              {stg.description}
                            </p>
                          </div>

                          <span className={`text-[10px] font-pixel px-2 py-0.5 rounded ${
                            isSelected ? 'bg-cozy-terracotta text-white font-bold' : 'bg-cozy-border text-cozy-brown-medium'
                          }`}>
                            {isSelected ? 'Viewing' : 'Inspect'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default SpiritPanel;
