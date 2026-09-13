import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RoomScene } from './RoomScene.jsx';

/**
 * RoomCanvas
 * Houses the Three.js Canvas with performance-capped DPR, isometric camera angles,
 * and carefully constrained OrbitControls that prevent floor clipping and pan escapes.
 */
export function RoomCanvas({
  equippedNames,
  simulateWebGLFailure = false,
  onResetView
}) {
  const controlsRef = useRef();

  if (simulateWebGLFailure) {
    throw new Error('Simulated WebGL Initialization Failure');
  }

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] rounded-pixel overflow-hidden bg-cozy-parchment/70 border-2 border-cozy-brown-dark shadow-pixel select-none">
      <Canvas
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
        camera={{
          position: [6.6, 5.4, 6.6],
          fov: 40,
          near: 0.1,
          far: 50
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false
        }}
      >
        <RoomScene equippedNames={equippedNames} />

        <OrbitControls
          ref={controlsRef}
          makeDefault={true}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2 - 0.06}
          minDistance={5.2}
          maxDistance={12.5}
          minAzimuthAngle={-Math.PI / 3.8}
          maxAzimuthAngle={Math.PI / 3.2}
          target={[0, 1.2, 0]}
          enableDamping={true}
          dampingFactor={0.06}
        />
      </Canvas>

      {/* Floating 3D Navigation Controls & Badge HUD */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <span className="px-2.5 py-1 bg-cozy-card/90 backdrop-blur-sm text-cozy-brown-dark text-[11px] font-pixel rounded border border-cozy-brown-light/60 shadow-pixel-sm flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cozy-sage animate-ping" />
          <span>3D Sanctuary View</span>
        </span>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Camera View"
          aria-label="Reset Camera View to Default"
          className="touch-target px-2.5 py-1 bg-cozy-card hover:bg-cozy-parchment text-cozy-brown-dark text-[11px] font-pixel rounded border border-cozy-brown-dark/40 shadow-pixel-sm transition active:scale-95"
        >
          🎯 Reset View
        </button>
      </div>

      {/* Bottom hint overlay */}
      <div className="absolute bottom-2.5 left-0 right-0 text-center pointer-events-none">
        <span className="px-3 py-1 bg-cozy-card/85 backdrop-blur-sm text-cozy-brown-medium text-[10px] font-pixel rounded-full border border-cozy-border shadow-sm">
          🖱️ Drag to orbit • Scroll to zoom • Pan disabled
        </span>
      </div>
    </div>
  );
}
