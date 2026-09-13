import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RoomUnlockModal
 * Distinct celebration modal displayed when leveling up unlocks a new sanctuary room.
 * Sequenced between the level-up celebration and achievement banners.
 */
export function RoomUnlockModal({ isOpen, onClose, room, onNavigateToRoom }) {
  const modalRef = useRef(null);
  const primaryButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

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
    };
  }, [isOpen, onClose]);

  if (!room) return null;

  const getRoomIcon = (name = '') => {
    if (name.includes('Reading') || name.includes('Nook')) return '📚';
    if (name.includes('Garden') || name.includes('Balcony')) return '🌿';
    return '🛋️';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cozy-brown-dark/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="room-unlock-title"
          aria-describedby="room-unlock-desc"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-md pixel-box bg-cozy-card border-4 border-cozy-sage-dark rounded-pixel p-6 sm:p-8 text-center space-y-6 shadow-pixel"
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cozy-sage text-white font-pixel text-xs font-bold tracking-wider shadow-pixel-sm">
              <span>✨</span> NEW SANCTUARY UNLOCKED <span>✨</span>
            </div>

            {/* Room Visual Icon & Emblem */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cozy-sage-light via-cozy-parchment to-cozy-sage flex items-center justify-center text-5xl shadow-pixel border-2 border-cozy-sage-dark"
              >
                {getRoomIcon(room.name)}
              </motion.div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 id="room-unlock-title" className="font-pixel text-2xl text-cozy-brown-dark font-bold">
                {room.name}
              </h2>
              <p id="room-unlock-desc" className="text-sm text-cozy-brown-medium leading-relaxed px-2">
                {room.description}
              </p>
            </div>

            {/* Level Requirement Badge */}
            <div className="inline-block bg-cozy-parchment px-3 py-1.5 rounded-pixel border border-cozy-border font-pixel text-xs text-cozy-sage-dark font-bold">
              Unlocked at Character Level {room.unlock_level}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onNavigateToRoom && (
                <button
                  ref={primaryButtonRef}
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToRoom(room);
                  }}
                  className="w-full sm:w-auto touch-target pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel text-sm font-bold px-6 py-3 rounded-pixel shadow-pixel-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cozy-brown-dark"
                >
                  🛋️ Visit Room Now
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto touch-target pixel-box bg-cozy-parchment hover:bg-cozy-parchment/80 text-cozy-brown-dark font-pixel text-sm font-bold px-5 py-3 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cozy-brown-dark"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default RoomUnlockModal;
