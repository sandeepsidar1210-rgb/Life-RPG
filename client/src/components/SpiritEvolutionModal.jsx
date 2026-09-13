import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SpiritCompanion } from './MyRoom/SpiritModels.jsx';

/**
 * SpiritEvolutionModal
 * Metamorphosis celebration modal triggered when a scholar reaches Level 5 or Level 12.
 * Sequenced strictly: Level-Up Modal -> Spirit Evolution Modal -> Room Unlock Modal -> Achievement Banner.
 */
export function SpiritEvolutionModal({
  isOpen,
  onClose,
  evolutionData,
  onInspectSpirit
}) {
  const modalRef = useRef(null);
  const primaryButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      primaryButtonRef.current?.focus();
    }, 60);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!evolutionData) return null;

  const {
    previousStage = 1,
    newStage = 2,
    species = {},
    stageData = {},
    previousStageData = {}
  } = evolutionData;

  const speciesName = species?.name || 'Study Spirit';
  const prevStageName = previousStageData?.name || `Stage ${previousStage}`;
  const newStageName = stageData?.name || `Stage ${newStage}`;
  const modelKey = stageData?.model_key || stageData?.model_3d_key || `${(species?.attribute_type || 'focus') === 'focus' ? 'emberwisp' : (species?.attribute_type || 'discipline') === 'discipline' ? 'rootling' : (species?.attribute_type || 'vitality') === 'vitality' ? 'sproutling' : 'inkling'}_stage_${newStage}`;
  const loreDescription = stageData?.description || 'Your study spirit has transformed into a higher state of resonance through your dedicated study sessions!';

  const getAttributeBadge = (attr = 'focus') => {
    switch (attr.toLowerCase()) {
      case 'discipline':
        return { bg: 'bg-emerald-700 text-white', icon: '🛡️', label: 'Discipline Guardian' };
      case 'vitality':
        return { bg: 'bg-rose-700 text-white', icon: '🌱', label: 'Vitality Herald' };
      case 'creativity':
        return { bg: 'bg-indigo-700 text-white', icon: '✨', label: 'Creativity Muse' };
      default:
        return { bg: 'bg-amber-600 text-white', icon: '🔥', label: 'Focus Catalyst' };
    }
  };

  const badge = getAttributeBadge(species?.attribute_type || 'focus');

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cozy-brown-dark/75 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="spirit-evolution-title"
          aria-describedby="spirit-evolution-desc"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="w-full max-w-lg pixel-box bg-cozy-card border-4 border-cozy-terracotta-dark rounded-pixel p-6 sm:p-8 text-center space-y-5 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Aura */}
            <div
              className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-amber-400/20 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-orange-400/20 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Glowing Metamorphosis Banner */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600 via-cozy-terracotta to-amber-600 text-white font-pixel text-xs font-bold tracking-widest shadow-pixel-sm uppercase"
            >
              <span>✨</span> SPIRIT EVOLUTION REACHED <span>✨</span>
            </motion.div>

            {/* 3D Model Metamorphosis Showcase */}
            <div className="relative w-full h-44 sm:h-52 mx-auto rounded-pixel overflow-hidden bg-gradient-to-b from-cozy-parchment to-cozy-card border-2 border-cozy-border shadow-pixel-sm flex items-center justify-center">
              <Canvas
                tabIndex={-1}
                dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
                camera={{ position: [0, 0.4, 2.3], fov: 42 }}
                gl={{ antialias: true, alpha: true }}
              >
                <ambientLight intensity={1.2} />
                <directionalLight position={[3, 4, 3]} intensity={1.3} color="#FFF8E7" />
                <directionalLight position={[-3, -1, 2]} intensity={0.5} color="#FFE0B2" />
                <SpiritCompanion modelKey={modelKey} isPreview={true} />
                <OrbitControls
                  enablePan={false}
                  enableZoom={false}
                  autoRotate={true}
                  autoRotateSpeed={4}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 2}
                />
              </Canvas>

              <div className="absolute top-2 right-2 pointer-events-none">
                <span className={`px-2 py-0.5 text-[10px] font-pixel rounded-full ${badge.bg}`}>
                  {badge.icon} Stage {newStage}
                </span>
              </div>
            </div>

            {/* Evolution Progression Header */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs font-pixel text-cozy-brown-medium">
                <span className="line-through opacity-70">{prevStageName}</span>
                <span className="text-cozy-terracotta font-bold text-sm">➔</span>
                <span className="text-cozy-terracotta-dark font-bold text-sm">{newStageName}</span>
              </div>

              <h2
                id="spirit-evolution-title"
                className="text-xl sm:text-2xl font-pixel text-cozy-brown-dark font-bold tracking-wide"
              >
                Your {speciesName} Has Evolved!
              </h2>
            </div>

            {/* Lore & Transformation Notes */}
            <div className="pixel-box bg-cozy-parchment p-3.5 rounded-pixel border border-cozy-brown-dark/20 text-left">
              <p id="spirit-evolution-desc" className="text-xs sm:text-sm text-cozy-brown-dark leading-relaxed">
                {loreDescription}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                ref={primaryButtonRef}
                type="button"
                onClick={() => {
                  onClose();
                  if (onInspectSpirit) onInspectSpirit();
                }}
                className="flex-1 touch-target pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel text-xs sm:text-sm py-3 px-4 rounded-pixel font-bold shadow-pixel-sm transition active:scale-95 flex items-center justify-center gap-1.5 focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
              >
                <span>✨ Inspect in Sanctuary</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="touch-target pixel-box-interactive bg-cozy-parchment hover:bg-cozy-border text-cozy-brown-dark font-pixel text-xs sm:text-sm py-3 px-4 rounded-pixel font-bold border-2 border-cozy-brown-dark transition active:scale-95 focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
              >
                Continue Studying
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SpiritEvolutionModal;
