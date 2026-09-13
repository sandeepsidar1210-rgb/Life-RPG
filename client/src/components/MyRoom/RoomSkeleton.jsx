import React from 'react';

export function RoomSkeleton() {
  return (
    <div 
      role="status" 
      aria-live="polite"
      aria-label="Loading 3D Study Sanctuary"
      className="pixel-box bg-cozy-card p-6 sm:p-10 rounded-pixel text-center space-y-6 border-2 border-cozy-brown-dark shadow-pixel animate-pulse"
    >
      <div className="w-full h-80 sm:h-96 rounded-pixel bg-cozy-parchment/60 border-2 border-cozy-border flex flex-col items-center justify-center space-y-4">
        {/* Animated 3D Isometric Voxel Cube Placeholder */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="w-14 h-14 bg-cozy-sage/40 border-2 border-cozy-sage rounded-pixel rotate-45 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="absolute text-3xl select-none" aria-hidden="true">
            🛋️
          </div>
        </div>

        <div className="space-y-2 max-w-sm px-4">
          <h3 className="text-lg font-pixel text-cozy-brown-dark">
            Assembling 3D Study Sanctuary...
          </h3>
          <p className="text-xs text-cozy-brown-medium font-pixel">
            Sculpting oak desk, warming amber lamp & summoning companions
          </p>
        </div>

        {/* Mini progress bar simulation */}
        <div className="w-48 h-2.5 bg-cozy-parchment rounded-full border border-cozy-border overflow-hidden">
          <div className="h-full bg-cozy-terracotta rounded-full w-2/3 animate-pulse" />
        </div>
      </div>
      <span className="sr-only">Loading 3D Room scene, please wait...</span>
    </div>
  );
}
