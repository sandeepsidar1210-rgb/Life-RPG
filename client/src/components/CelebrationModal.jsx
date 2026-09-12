import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CelebrationModal({ isOpen, onClose, levelData }) {
  if (!isOpen || !levelData) return null;

  const { levelsGained, newLevel, rewards } = levelData;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        {/* Animated Celebration Card */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 18, stiffness: 260 }}
          className="relative w-full max-w-md pixel-box bg-cozy-card p-6 sm:p-8 rounded-pixel shadow-pixel-lg text-center overflow-hidden border-4 border-cozy-brown-dark"
        >
          {/* Confetti / Sparkles floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {['✨', '⭐', '🎉', '🍂', '🌟', '🪙'].map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ y: -20, x: (i - 2.5) * 60, opacity: 0, rotate: 0 }}
                animate={{
                  y: [ -20, 260 ],
                  opacity: [0, 1, 0],
                  rotate: [0, (i % 2 === 0 ? 360 : -360)]
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: 'easeOut'
                }}
                className="absolute text-xl select-none"
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          {/* Level Up Banner */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
            className="w-20 h-20 mx-auto pixel-box bg-cozy-gold-light rounded-pixel flex items-center justify-center text-4xl shadow-pixel mb-4 border-2 border-cozy-brown-dark"
          >
            🏆
          </motion.div>

          <span className="inline-block px-3 py-1 bg-cozy-gold-base text-white text-xs font-pixel rounded-pixel font-bold mb-2 shadow-pixel-sm">
            {levelsGained > 1 ? `MULTI-LEVEL UP! (+${levelsGained} LEVELS)` : 'LEVEL UP!'}
          </span>

          <h2 className="text-2xl sm:text-3xl font-pixel text-cozy-brown-dark tracking-wide mb-1">
            Congratulations, Scholar!
          </h2>
          <p className="text-sm text-cozy-brown-medium mb-5">
            Your steadfast focus has unlocked a new tier of wisdom.
          </p>

          {/* New Level Badge Card */}
          <div className="pixel-box bg-cozy-parchment p-4 rounded-pixel mb-5 border-2 border-cozy-brown-dark/80">
            <div className="text-xs text-cozy-brown-medium font-pixel uppercase">Current Title</div>
            <div className="text-2xl sm:text-3xl font-pixel font-bold text-cozy-sage-dark my-1">
              Level {newLevel} Scholar
            </div>
            {rewards?.attribute && (
              <div className="text-xs text-cozy-terracotta-dark font-medium mt-1">
                +1 {rewards.attribute.toUpperCase()} attribute boost gained!
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel py-3 rounded-pixel font-bold text-sm sm:text-base shadow-pixel-sm transition"
          >
            🌱 Continue Your Journey
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
