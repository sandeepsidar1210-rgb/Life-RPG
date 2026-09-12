import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`pointer-events-auto pixel-box p-3.5 rounded-pixel text-xs sm:text-sm font-medium shadow-pixel flex items-start justify-between gap-3 ${
              toast.type === 'error'
                ? 'bg-cozy-terracotta-subtle text-cozy-terracotta-dark border-cozy-terracotta-dark'
                : toast.type === 'success'
                ? 'bg-cozy-sage-subtle text-cozy-sage-dark border-cozy-sage-dark'
                : 'bg-cozy-parchment text-cozy-brown-dark border-cozy-brown-dark'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-base select-none">
                {toast.type === 'error' ? '⚠️' : toast.type === 'success' ? '✨' : 'ℹ️'}
              </span>
              <p className="leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-xs opacity-70 hover:opacity-100 font-bold px-1"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
