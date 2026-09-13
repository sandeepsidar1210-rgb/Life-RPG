import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AchievementBanner
 *
 * A lightweight slide-in banner for newly unlocked achievements.
 * Intentionally lighter than the level-up CelebrationModal — it shows
 * one achievement at a time and auto-dismisses after 5 seconds.
 *
 * Props:
 *   achievement  - the achievement object to display (or null to hide)
 *   onDismiss    - callback to dismiss
 */
export function AchievementBanner({ achievement, onDismiss }) {
  const timerRef = useRef(null);
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    if (achievement) {
      // Auto-dismiss after 5 seconds
      timerRef.current = setTimeout(() => {
        dismissRef.current?.();
      }, 5000);
    }
    return () => clearTimeout(timerRef.current);
  }, [achievement]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          initial={{ x: '110%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '110%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 right-5 z-50 max-w-xs w-full sm:max-w-sm pointer-events-auto"
        >
          <div className="pixel-box bg-gradient-to-br from-cozy-parchment via-white to-cozy-sage-subtle border-2 border-cozy-sage-dark rounded-pixel shadow-pixel p-4 flex items-start gap-3">
            {/* Icon */}
            <div
              aria-hidden="true"
              className="text-3xl w-12 h-12 flex-shrink-0 flex items-center justify-center bg-cozy-sage-subtle rounded-pixel border-2 border-cozy-sage-dark shadow-pixel-sm"
            >
              {achievement.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-pixel text-cozy-sage-dark uppercase tracking-wider mb-0.5">
                🏆 Achievement Unlocked!
              </p>
              <p className="font-pixel text-sm text-cozy-brown-dark leading-tight mb-1">
                {achievement.name}
              </p>
              <p className="text-[11px] text-cozy-brown-medium leading-relaxed line-clamp-2">
                {achievement.description}
              </p>
              {achievement.reward_coins > 0 && (
                <p className="text-[11px] font-pixel text-cozy-sage-dark mt-1 flex items-center gap-1">
                  <span aria-hidden="true">🪙</span>
                  <span>+{achievement.reward_coins} Cozy Coins earned!</span>
                </p>
              )}
            </div>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={onDismiss}
              aria-label={`Dismiss ${achievement.name} achievement notification`}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded hover:bg-black/10 text-cozy-brown-medium hover:text-cozy-brown-dark transition focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
            >
              ✕
            </button>
          </div>

          {/* Progress bar countdown */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 5, ease: 'linear' }}
            style={{ transformOrigin: 'left' }}
            className="h-0.5 bg-cozy-sage-dark mt-1 rounded-full"
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
