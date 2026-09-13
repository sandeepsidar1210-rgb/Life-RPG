import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RoomScene } from './RoomScene.jsx';

/**
 * RoomCanvas
 * Houses the Three.js Canvas with performance-capped DPR, isometric camera angles,
 * constrained OrbitControls, semantic ARIA region, and an immersive Full-Screen mode.
 */
export function RoomCanvas({
  equippedNames = new Set(),
  roomName = 'Study Desk',
  simulateWebGLFailure = false,
  onResetView
}) {
  const controlsRef = useRef();
  const containerRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (simulateWebGLFailure) {
    throw new Error('Simulated WebGL Initialization Failure');
  }

  // Handle native & CSS fullscreen toggling
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      // Try native HTML5 Fullscreen API first
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } catch (err) {
        console.info('[Fullscreen API fallback to CSS overlay]', err);
      }
      setIsFullscreen(true);
    } else {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch (err) {
        console.info('[Exit Fullscreen error]', err);
      }
      setIsFullscreen(false);
    }
  };

  // Sync state if user exits via browser native Escape key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e) => {
      // Escape closes custom CSS fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      // 'f' or 'F' toggles fullscreen when not typing in inputs
      if (
        (e.key === 'f' || e.key === 'F') &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      ) {
        toggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const equippedCount = equippedNames.size;

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="3D study room showing your equipped decor and companion"
      className={`relative rounded-pixel overflow-hidden bg-cozy-parchment/70 border-2 border-cozy-brown-dark shadow-pixel select-none transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-none shadow-none bg-cozy-cream'
          : 'w-full h-[380px] sm:h-[460px] md:h-[500px]'
      }`}
    >
      {/* Hidden screen-reader description of the 3D room contents */}
      <div className="sr-only" aria-live="polite">
        Interactive 3D Study Sanctuary. Currently displaying {equippedCount} equipped furnishings in low-poly 3D.
        Controls: Click and drag with mouse or touch to orbit around the study desk.
        Full keyboard controls to place or unequip items are available in the Scholar's Trunk panel.
      </div>

      <Canvas
        tabIndex={-1}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
        camera={{
          position: isFullscreen ? [6.2, 5.0, 6.2] : [6.6, 5.4, 6.6],
          fov: isFullscreen ? 38 : 40,
          near: 0.1,
          far: 50
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false
        }}
      >
        {/* Low-Poly 3D Sanctuary Room & Equippables */}
        <RoomScene equippedNames={equippedNames} roomName={roomName} />

        <OrbitControls
          ref={controlsRef}
          makeDefault={true}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2 - 0.06}
          minDistance={isFullscreen ? 4.5 : 5.2}
          maxDistance={isFullscreen ? 14.0 : 12.5}
          minAzimuthAngle={-Math.PI / 3.8}
          maxAzimuthAngle={Math.PI / 3.2}
          target={[0, 1.2, 0]}
          enableDamping={true}
          dampingFactor={0.06}
        />
      </Canvas>

      {/* Floating 3D Navigation Controls & HUD Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <span className="px-2.5 py-1 bg-cozy-card/90 backdrop-blur-sm text-cozy-brown-dark text-[11px] font-pixel rounded border border-cozy-brown-light/60 shadow-pixel-sm flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cozy-sage animate-ping" aria-hidden="true" />
          <span>{isFullscreen ? '3D Immersive Haven' : '3D Sanctuary View'}</span>
        </span>
      </div>

      {/* Action Buttons: Fullscreen & Reset Camera */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Camera View to default perspective"
          aria-label="Reset Camera View to Default"
          className="touch-target px-3 py-1.5 bg-cozy-card hover:bg-cozy-parchment text-cozy-brown-dark text-xs font-pixel rounded border-2 border-cozy-brown-dark shadow-pixel-sm transition active:scale-95 focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
        >
          <span aria-hidden="true">🎯</span>
          <span className="ml-1 hidden sm:inline">Reset View</span>
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen mode (Esc)' : 'Expand 3D Room to Full Screen'}
          aria-label={isFullscreen ? 'Exit Fullscreen 3D View' : 'Expand 3D room to full screen'}
          className={`touch-target px-3 py-1.5 font-pixel text-xs rounded border-2 border-cozy-brown-dark shadow-pixel-sm transition active:scale-95 flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-cozy-brown-dark ${
            isFullscreen
              ? 'bg-cozy-terracotta text-white hover:bg-cozy-terracotta-dark'
              : 'bg-cozy-sage text-white hover:bg-cozy-sage-dark'
          }`}
        >
          <span aria-hidden="true">{isFullscreen ? '✕' : '⛶'}</span>
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
        </button>
      </div>

      {/* Bottom hint overlay */}
      <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none px-4">
        <span className="inline-block px-3.5 py-1.5 bg-cozy-card/90 backdrop-blur-sm text-cozy-brown-medium text-[11px] font-pixel rounded-full border border-cozy-border shadow-sm">
          🖱️ Drag to orbit • Scroll to zoom • {isFullscreen ? 'Press Esc to exit' : 'Press F for Fullscreen'}
        </span>
      </div>
    </div>
  );
}
