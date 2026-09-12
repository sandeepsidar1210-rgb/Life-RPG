import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-cozy-cream flex flex-col items-center justify-center p-6 text-cozy-brown-dark">
        {/* Cozy Loading Skeleton */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md pixel-box bg-cozy-card p-8 rounded-pixel space-y-6 shadow-pixel"
        >
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 bg-cozy-parchment rounded-pixel border-2 border-cozy-brown-light/40 flex items-center justify-center text-xl">
              📖
            </div>
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-cozy-brown-light/30 rounded w-3/4"></div>
              <div className="h-3 bg-cozy-brown-light/20 rounded w-1/2"></div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="h-4 bg-cozy-parchment rounded w-full animate-pulse"></div>
            <div className="h-4 bg-cozy-parchment rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-cozy-parchment rounded w-2/3 animate-pulse"></div>
          </div>

          {/* Character Stats Skeleton Bars */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-cozy-parchment/60 rounded border border-cozy-brown-light/30 animate-pulse space-y-2">
                <div className="h-3 bg-cozy-brown-light/30 rounded w-1/2"></div>
                <div className="h-2 bg-cozy-brown-light/20 rounded w-full"></div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <p className="font-pixel text-xs text-cozy-brown-medium tracking-wide animate-pulse">
              Preparing your cozy study room...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    // Redirect to /login preserving target location for smooth return after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
