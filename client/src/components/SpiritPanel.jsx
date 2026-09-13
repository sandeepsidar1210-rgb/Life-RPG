import React, { useState, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { SpiritCompanion } from './MyRoom/SpiritModels.jsx';

/**
 * SpiritPanel
 * Dedicated "My Spirit" sanctuary view showcasing the scholar's bound Study Spirit,
 * full 360° interactive 3D inspection viewport, species lore, evolution stage roadmap,
 * and next evolution teaser card.
 */
export function SpiritPanel({
  spiritData = null,
  userLevel = 1,
  onNavigateToQuests
}) {
  const controlsRef = useRef();

  // Extract properties with fallbacks
  const species = spiritData?.species || {
    name: 'Emberwisp',
    attribute_type: 'focus',
    lore_description: 'Born from the glowing embers of study hearths and candlelit tomes. Emberwisps thrive in moments of deep, unbroken concentration and illuminate late-night revisions.'
  };

  const currentStage = spiritData?.current_stage || {
    stage_number: userLevel >= 12 ? 3 : (userLevel >= 5 ? 2 : 1),
    name: userLevel >= 12 ? 'Emberwisp Pyrespirit' : (userLevel >= 5 ? 'Emberwisp Lantern' : 'Emberwisp Spark'),
    description: 'A tiny steam-and-ember wisp glowing with soft golden light, bobbing inquisitively as you study.',
    unlock_level: 1,
    model_key: 'emberwisp_stage_1'
  };

  const currentStageNum = currentStage?.stage_number || spiritData?.spirit?.current_stage || 1;
  const allStages = spiritData?.all_stages || [
    {
      stage_number: 1,
      name: `${species.name} (Form I)`,
      unlock_level: 1,
      description: 'The nascent spirit form adopted at the start of your scholar journey.',
      is_unlocked: true,
      is_current: currentStageNum === 1
    },
    {
      stage_number: 2,
      name: `${species.name} (Form II)`,
      unlock_level: 5,
      description: 'Evolves at Level 5 with enhanced auras, protective lanterns, or blossoming wings.',
      is_unlocked: userLevel >= 5,
      is_current: currentStageNum === 2
    },
    {
      stage_number: 3,
      name: `${species.name} (Form III)`,
      unlock_level: 12,
      description: 'The pinnacle cosmic manifestation attained at Level 12.',
      is_unlocked: userLevel >= 12,
      is_current: currentStageNum === 3
    }
  ];

  const nextStage = spiritData?.next_stage || (currentStageNum < 3 ? allStages.find(s => s.stage_number === currentStageNum + 1) : null);
  const levelsRemaining = nextStage ? Math.max(0, nextStage.unlock_level - userLevel) : 0;

  // Nickname feature (persisted locally)
  const defaultName = species?.name || 'Study Spirit';
  const [nickname, setNickname] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('life_rpg_spirit_nickname') || defaultName;
      } catch (_) {
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
      } catch (_) {}
    }
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Compute model key for 3D view
  const activeModelKey = useMemo(() => {
    if (currentStage?.model_3d_key) return currentStage.model_3d_key;
    if (currentStage?.model_key) return currentStage.model_key;
    const attr = species?.attribute_type || 'focus';
    const prefix = attr === 'discipline' ? 'rootling' : attr === 'vitality' ? 'sproutling' : attr === 'creativity' ? 'inkling' : 'emberwisp';
    return `${prefix}_stage_${currentStageNum}`;
  }, [currentStage, species, currentStageNum]);

  // Attribute styling & badges
  const getAttrTheme = (attr = 'focus') => {
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

  const attrTheme = getAttrTheme(species?.attribute_type || 'focus');

  return (
    <section aria-labelledby="spirit-sanctuary-heading" className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 id="spirit-sanctuary-heading" className="text-xl sm:text-2xl font-pixel text-cozy-brown-dark flex items-center gap-2">
            <span aria-hidden="true">✨</span> Study Spirit Companion
          </h2>
          <p className="text-xs text-cozy-brown-medium">
            Permanent celestial companion bonded to your {attrTheme.title} attribute • Evolves with your Scholar Level
          </p>
        </div>

        <div className={`text-xs font-pixel px-3 py-1.5 rounded-pixel border-2 ${attrTheme.borderColor} ${attrTheme.bgColor} ${attrTheme.color} flex items-center gap-1.5 shadow-pixel-xs`}>
          <span>{attrTheme.icon}</span>
          <span className="font-bold">{attrTheme.title} Affinity</span>
          <span>• Stage {currentStageNum}/3</span>
        </div>
      </div>

      {/* Main Grid: 3D Viewport on Left, Lore & Next Evolution on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Inspection Canvas */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4">
          <div className="relative rounded-pixel overflow-hidden bg-gradient-to-b from-cozy-parchment to-cozy-card border-2 border-cozy-brown-dark shadow-pixel h-[380px] sm:h-[440px] select-none">
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

              <SpiritCompanion modelKey={activeModelKey} isPreview={true} />

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

            {/* HUD Status Tag */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="px-2.5 py-1 bg-cozy-card/90 backdrop-blur-sm text-cozy-brown-dark text-[11px] font-pixel rounded border border-cozy-brown-light/60 shadow-pixel-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cozy-sage animate-ping" aria-hidden="true" />
                <span>360° Spirit Inspection</span>
              </span>
            </div>

            {/* Reset View Button */}
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

            {/* Hint Overlay */}
            <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none px-4">
              <span className="inline-block px-3.5 py-1.5 bg-cozy-card/90 backdrop-blur-sm text-cozy-brown-medium text-[11px] font-pixel rounded-full border border-cozy-border shadow-sm">
                🖱️ Drag with mouse or touch to orbit around {nickname} • Scroll to zoom
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
                {currentStage?.name || `${species.name} Stage ${currentStageNum}`} • {species.name} Species
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
          {/* Next Evolution Teaser Card (Crucial Feature) */}
          <div className={`pixel-box p-5 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel relative overflow-hidden ${
            currentStageNum >= 3 ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white' : 'bg-cozy-card text-cozy-brown-dark'
          }`}>
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
                  Your spirit has reached its ultimate celestial manifestation! Bound permanently to your study journey, it radiates pure cosmic inspiration across all sanctuary chambers.
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
                        width: `${Math.min(100, Math.max(10, ((userLevel - (currentStageNum === 1 ? 1 : 5)) / ((nextStage?.unlock_level || 5) - (currentStageNum === 1 ? 1 : 5))) * 100))}%`
                      }}
                    />
                  </div>
                </div>

                <p className="text-xs text-cozy-brown-dark leading-relaxed italic bg-cozy-parchment/60 p-2.5 rounded border border-cozy-border">
                  "{nextStage?.description || 'A greater metamorphosis awaits when your concentration deepens further.'}"
                </p>

                {onNavigateToQuests && (
                  <button
                    type="button"
                    onClick={onNavigateToQuests}
                    className="w-full touch-target pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel text-xs py-2 px-3 rounded font-bold shadow-pixel-xs transition flex items-center justify-center gap-1.5 focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
                  >
                    <span>📜 Complete Quests to Level Up</span>
                  </button>
                )}
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
                Earns resonance whenever you complete {attrTheme.title}-aligned study quests. Your companion naturally joins you in every 3D sanctuary room you unlock.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Stage Roadmap (Stages 1 -> 2 -> 3) */}
      <div className="pixel-box bg-cozy-card p-6 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cozy-border pb-3">
          <div>
            <h3 className="text-base font-pixel font-bold text-cozy-brown-dark flex items-center gap-2">
              <span>🌱</span> Evolution Stage Roadmap
            </h3>
            <p className="text-xs text-cozy-brown-medium">
              Three distinct metamorphosis stages unlocked through dedication and scholar mastery
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

            return (
              <motion.div
                key={stg.stage_number}
                whileHover={{ y: -2 }}
                className={`pixel-box p-4 rounded-pixel border-2 transition relative flex flex-col justify-between ${
                  isCurrent
                    ? 'border-cozy-terracotta bg-cozy-parchment shadow-pixel'
                    : isUnlocked
                    ? 'border-cozy-sage bg-cozy-card shadow-pixel-xs'
                    : 'border-cozy-border/80 bg-cozy-parchment/40 opacity-75'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-pixel px-2 py-0.5 rounded-full font-bold uppercase ${
                      isCurrent
                        ? 'bg-cozy-terracotta text-white'
                        : isUnlocked
                        ? 'bg-cozy-sage text-white'
                        : 'bg-cozy-border text-cozy-brown-medium'
                    }`}>
                      Stage {stg.stage_number}
                    </span>

                    <span className="text-xs font-pixel">
                      {isCurrent ? (
                        <span className="text-cozy-terracotta-dark font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-cozy-terracotta animate-ping" />
                          Active
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-cozy-sage-dark font-bold">✓ Mastered</span>
                      ) : (
                        <span className="text-cozy-brown-medium">🔒 Level {stg.unlock_level}</span>
                      )}
                    </span>
                  </div>

                  <h4 className="text-sm font-pixel font-bold text-cozy-brown-dark">
                    {stg.name}
                  </h4>

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
    </section>
  );
}

export default SpiritPanel;
