import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CelebrationModal({ isOpen, onClose, levelData, triggerRef }) {
  const modalRef = useRef(null);
  const primaryButtonRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  // Focus trap & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus on close
    lastActiveElementRef.current = triggerRef?.current || document.activeElement;

    // Focus primary button when modal opens
    const timer = setTimeout(() => {
      primaryButtonRef.current?.focus();
    }, 50);

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
      // Restore focus to trigger element
      if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === 'function') {
        lastActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || !levelData) return null;

  const { levelsGained, newLevel, rewards } = levelData;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        role="presentation"
      >
        {/* Animated Celebration Dialog */}
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-title"
          aria-describedby="celebration-desc"
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 18, stiffness: 260 }}
          className="relative w-full max-w-md pixel-box bg-cozy-card p-6 sm:p-8 rounded-pixel shadow-pixel-lg text-center overflow-hidden border-4 border-cozy-brown-dark"
        >
          {/* Confetti / Sparkles floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {['✨', '⭐', '🎉', '🍂', '🌟', '🪙'].map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ y: -20, x: (i - 2.5) * 60, opacity: 0, rotate: 0 }}
                animate={{
                  y: [ -20, 280 ],
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
          <div
            className="w-20 h-20 mx-auto pixel-box bg-cozy-gold-light rounded-pixel flex items-center justify-center text-4xl shadow-pixel mb-4 border-2 border-cozy-brown-dark select-none"
            aria-hidden="true"
          >
            🏆
          </div>

          <span className="inline-block px-3 py-1 bg-cozy-gold-base text-white text-xs font-pixel rounded-pixel font-bold mb-2 shadow-pixel-sm">
            {levelsGained > 1 ? `MULTI-LEVEL UP! (+${levelsGained} LEVELS)` : 'LEVEL UP!'}
          </span>

          <h2 
            id="celebration-title"
            className="text-2xl sm:text-3xl font-pixel text-cozy-brown-dark tracking-wide mb-1"
          >
            Congratulations, Scholar!
          </h2>
          <p 
            id="celebration-desc"
            className="text-sm text-cozy-brown-medium mb-5"
          >
            Your steadfast focus has unlocked a new tier of wisdom.
          </p>

          {/* New Level Badge Card */}
          <div className="pixel-box bg-cozy-parchment p-4 rounded-pixel mb-5 border-2 border-cozy-brown-dark/80">
            <div className="text-xs text-cozy-brown-medium font-pixel uppercase tracking-wider">Current Title</div>
            <div className="text-2xl sm:text-3xl font-pixel font-bold text-cozy-sage-dark my-1">
              Level {newLevel} Scholar
            </div>
            {rewards?.attribute && (
              <div className="text-xs text-cozy-terracotta-dark font-medium mt-1">
                +1 {rewards.attribute.toUpperCase()} attribute boost gained!
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              ref={primaryButtonRef}
              type="button"
              onClick={onClose}
              className="w-full touch-target pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel py-3 rounded-pixel font-bold text-sm sm:text-base shadow-pixel-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cozy-brown-dark"
            >
              🌱 Continue Your Journey
            </button>
            <p className="text-[11px] text-cozy-brown-medium">
              Press <kbd className="px-1 py-0.5 bg-cozy-parchment rounded border border-cozy-border font-mono text-[10px]">Esc</kbd> or <kbd className="px-1 py-0.5 bg-cozy-parchment rounded border border-cozy-border font-mono text-[10px]">Enter</kbd> to dismiss
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
