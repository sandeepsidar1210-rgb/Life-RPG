import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <aside 
      aria-label="Notifications"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          return (
            <motion.div
              key={toast.id}
              role={isError ? 'alert' : 'status'}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className={`pointer-events-auto pixel-box p-3.5 rounded-pixel text-xs sm:text-sm font-medium shadow-pixel flex items-start justify-between gap-3 ${
                isError
                  ? 'bg-cozy-terracotta-subtle text-cozy-terracotta-dark border-cozy-terracotta-dark'
                  : toast.type === 'success'
                  ? 'bg-cozy-sage-subtle text-cozy-sage-dark border-cozy-sage-dark'
                  : 'bg-cozy-parchment text-cozy-brown-dark border-cozy-brown-dark'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-base select-none" aria-hidden="true">
                  {isError ? '⚠️' : toast.type === 'success' ? '✨' : 'ℹ️'}
                </span>
                <p className="leading-snug">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
                className="touch-target min-h-[32px] min-w-[32px] text-xs font-bold px-2 py-1 rounded hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cozy-brown-dark"
              >
                ✕
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
}
