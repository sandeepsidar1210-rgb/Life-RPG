import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-cozy-cream flex items-center justify-center p-4 sm:p-6 font-sans select-none">
      <div className="w-full max-w-md pixel-box bg-cozy-card p-6 sm:p-10 rounded-pixel shadow-pixel-lg border-4 border-cozy-brown-dark text-center space-y-5">
        {/* Themed Icon */}
        <div 
          className="w-20 h-20 mx-auto pixel-box bg-cozy-gold-light rounded-pixel flex items-center justify-center text-4xl shadow-pixel-sm border-2 border-cozy-gold-base select-none"
          aria-hidden="true"
        >
          🦉🗺️
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-cozy-terracotta-subtle text-cozy-terracotta-dark text-xs font-pixel font-bold rounded border border-cozy-terracotta">
            404 NOT FOUND
          </span>
          <h1 className="font-pixel text-xl sm:text-2xl text-cozy-brown-dark">
            Lost in the Ancient Stacks
          </h1>
          <p className="text-xs sm:text-sm text-cozy-brown-medium leading-relaxed max-w-sm mx-auto">
            The study chamber, parchment, or tome you are searching for seems to have vanished from the archives.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex touch-target pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel text-xs sm:text-sm px-6 py-3 rounded-pixel font-bold shadow-pixel-sm transition items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cozy-brown-dark"
          >
            <span aria-hidden="true">🏠</span> Return to Sanctuary
          </Link>
        </div>

        <p className="text-[11px] text-cozy-brown-light font-pixel">
          Life RPG • Cozy Productivity Sanctuary
        </p>
      </div>
    </div>
  );
}

export default NotFound;
