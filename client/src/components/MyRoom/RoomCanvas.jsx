import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { RoomScene } from './RoomScene.jsx';
import { useScholar } from '../../context/ScholarContext.jsx';

/**
 * SmoothCameraController
 * Interpolates camera position and OrbitControls look-at target with a cubic ease-out
 * tween over 450-550ms for deliberate, cinematic camera resets and fullscreen transitions.
 */
function SmoothCameraController({ resetTrigger, isFullscreen, controlsRef }) {
  const { camera } = useThree();
  const animatingRef = useRef(false);
  const animStateRef = useRef({
    startTime: 0,
    duration: 550,
    startPos: new THREE.Vector3(),
    targetPos: new THREE.Vector3(),
    startLookAt: new THREE.Vector3(),
    targetLookAt: new THREE.Vector3(0, 1.8, 0)
  });

  const triggerAnimation = useCallback((toPos, toTarget, duration = 550) => {
    const currentPos = camera.position.clone();
    const currentTarget = controlsRef.current
      ? controlsRef.current.target.clone()
      : new THREE.Vector3(0, 1.8, 0);

    animStateRef.current = {
      startTime: performance.now(),
      duration,
      startPos: currentPos,
      targetPos: new THREE.Vector3(...toPos),
      startLookAt: currentTarget,
      targetLookAt: new THREE.Vector3(...toTarget)
    };
    animatingRef.current = true;
  }, [camera, controlsRef]);

  // When resetTrigger changes (user clicks "Reset View")
  useEffect(() => {
    if (resetTrigger > 0) {
      const defPos = isFullscreen ? [12.5, 10.0, 12.5] : [13.5, 11.0, 13.5];
      triggerAnimation(defPos, [0, 1.8, 0], 550);
    }
  }, [resetTrigger, isFullscreen, triggerAnimation]);

  // When Fullscreen state toggles, smoothly glide camera rather than jump-cutting
  const prevFullscreenRef = useRef(isFullscreen);
  useEffect(() => {
    if (prevFullscreenRef.current !== isFullscreen) {
      prevFullscreenRef.current = isFullscreen;
      const defPos = isFullscreen ? [12.5, 10.0, 12.5] : [13.5, 11.0, 13.5];
      triggerAnimation(defPos, [0, 1.8, 0], 500);
    }
  }, [isFullscreen, triggerAnimation]);

  useFrame(() => {
    if (!animatingRef.current) return;
    const now = performance.now();
    const elapsed = now - animStateRef.current.startTime;
    const progress = Math.min(1, elapsed / animStateRef.current.duration);

    // Ease-out cubic curve for natural deceleration
    const ease = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(
      animStateRef.current.startPos,
      animStateRef.current.targetPos,
      ease
    );

    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(
        animStateRef.current.startLookAt,
        animStateRef.current.targetLookAt,
        ease
      );
      controlsRef.current.update();
    }

    if (progress >= 1) {
      animatingRef.current = false;
    }
  });

  return null;
}

/**
 * RoomCanvas
 * Houses the Three.js Canvas with performance-capped DPR, isometric camera angles,
 * constrained OrbitControls, semantic ARIA region, immersive Full-Screen mode,
 * free placement mode hint banners, and visual rejection alerts.
 */
export function RoomCanvas({
  equippedNames = new Set(),
  equippedItems = [],
  roomName = 'Study Desk',
  spiritModelKey = null,
  simulateWebGLFailure = false,
  onResetView,
  placingItem = null,
  onCancelPlacement = null,
  onConfirmPlacement = null,
  onUpdateItemPosition = null
}) {
  const controlsRef = useRef();
  const containerRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [rejectionAlert, setRejectionAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  const { handleGreetSpirit, activeGreeting, dismissGreetingBubble, spiritGreetingPending } = useScholar();

  if (simulateWebGLFailure) {
    throw new Error('Simulated WebGL Initialization Failure');
  }

  // Handle rejection feedback notices
  const handleRejectionNotice = useCallback((msg) => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    setRejectionAlert(msg || 'Invalid placement spot! Choose an open area away from furniture.');
    alertTimeoutRef.current = setTimeout(() => {
      setRejectionAlert(null);
    }, 2800);
  }, []);

  // Handle native & CSS fullscreen toggling
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
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

  // Sync state if user exits via browser native Escape key or cancels placement mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (placingItem) {
          onCancelPlacement?.();
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
      if (
        (e.key === 'f' || e.key === 'F') &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) &&
        !placingItem
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
  }, [isFullscreen, placingItem, onCancelPlacement]);

  const handleResetCamera = () => {
    setResetTrigger(Date.now());
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
          : 'w-full h-[400px] sm:h-[480px] md:h-[520px]'
      }`}
    >
      {/* Hidden screen-reader description */}
      <div className="sr-only" aria-live="polite">
        Interactive 3D Study Sanctuary. Currently displaying {equippedCount} equipped furnishings in low-poly 3D.
        Controls: Click and drag with mouse to orbit. Drag placed furnishings to reposition them freely.
      </div>

      {/* Floating Free Placement Mode Instruction Banner */}
      <AnimatePresence>
        {placingItem && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-30 max-w-md w-[92%] sm:w-auto"
          >
            <div className="px-4 py-2.5 bg-amber-500/95 text-white font-pixel text-xs sm:text-sm rounded-pixel border-2 border-amber-700 shadow-pixel flex items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="animate-bounce text-base">🎯</span>
                <span>
                  Click anywhere on the floor to place <strong>{placingItem.item?.name}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={onCancelPlacement}
                className="touch-target px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded font-bold text-xs uppercase transition cursor-pointer"
                title="Cancel placement mode (Escape)"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Rejection Warning Banner (Invalid placement/drop feedback) */}
      <AnimatePresence>
        {rejectionAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-28 left-1/2 -translate-x-1/2 z-30 max-w-sm w-[90%] sm:w-auto"
          >
            <div className="px-3.5 py-2 bg-rose-600/95 text-white font-pixel text-xs rounded-pixel border-2 border-rose-800 shadow-pixel flex items-center gap-2.5 backdrop-blur-md">
              <span className="text-sm">⚠️</span>
              <span>{rejectionAlert}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas
        tabIndex={-1}
        shadows
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
        camera={{
          position: isFullscreen ? [12.5, 10.0, 12.5] : [13.5, 11.0, 13.5],
          fov: isFullscreen ? 40 : 42,
          near: 0.1,
          far: 80
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false
        }}
      >
        {/* Low-Poly 3D Sanctuary Room & Equippables */}
        <RoomScene
          equippedItems={equippedItems}
          roomName={roomName}
          spiritModelKey={spiritModelKey}
          onGreet={handleGreetSpirit}
          placingItem={placingItem}
          onConfirmPlacement={onConfirmPlacement}
          onCancelPlacement={onCancelPlacement}
          onUpdateItemPosition={onUpdateItemPosition}
          onSetControlsEnabled={setControlsEnabled}
          onRejectionNotice={handleRejectionNotice}
        />

        {/* Subtle Bloom Post-Processing on Warm Light Sources */}
        <EffectComposer multisampling={0} disableNormalPass>
          <Bloom
            luminanceThreshold={0.85}
            luminanceSmoothing={0.2}
            intensity={0.4}
            mipmapBlur
          />
        </EffectComposer>

        {/* Smooth Cinematic Camera Transition / Reset Controller */}
        <SmoothCameraController
          resetTrigger={resetTrigger}
          isFullscreen={isFullscreen}
          controlsRef={controlsRef}
        />

        <OrbitControls
          ref={controlsRef}
          makeDefault={true}
          enabled={controlsEnabled}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={isFullscreen ? 7.5 : 8.5}
          maxDistance={isFullscreen ? 28.0 : 26.0}
          minAzimuthAngle={-Math.PI / 3.8}
          maxAzimuthAngle={Math.PI / 3.2}
          target={[0, 1.8, 0]}
          enableDamping={true}
          dampingFactor={0.06}
        />
      </Canvas>

      {/* Floating 3D Navigation Controls & HUD Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-10">
        <span className="px-2.5 py-1 bg-cozy-card/90 backdrop-blur-sm text-cozy-brown-dark text-[11px] font-pixel rounded border border-cozy-brown-light/60 shadow-pixel-sm flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cozy-sage animate-ping" aria-hidden="true" />
          <span>{isFullscreen ? '3D Immersive Haven' : '3D Sanctuary View'}</span>
        </span>
      </div>

      {/* Interactive Spirit Greeting Speech Bubble Overlay */}
      <AnimatePresence>
        {activeGreeting && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className={`absolute top-14 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-md z-20 p-3.5 rounded-pixel border-2 shadow-pixel ${
              activeGreeting.isResting
                ? 'bg-cozy-parchment/95 backdrop-blur-md border-cozy-brown-dark text-cozy-brown-dark'
                : 'bg-cozy-card/95 backdrop-blur-md border-amber-600 text-cozy-brown-dark ring-2 ring-amber-400/40'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">{activeGreeting.isResting ? '🌙' : '✨'}</span>
                <span className="font-pixel font-bold text-xs text-cozy-brown-dark">
                  {activeGreeting.speciesName}
                  {activeGreeting.isResting && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-cozy-brown-dark/10 font-normal">
                      Resting ({activeGreeting.cooldownRemaining})
                    </span>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={dismissGreetingBubble}
                className="touch-target text-xs text-cozy-brown-medium hover:text-cozy-brown-dark p-1 cursor-pointer"
                aria-label="Dismiss greeting"
              >
                ✕
              </button>
            </div>
            <p className="text-xs mt-1.5 leading-relaxed italic font-pixel text-cozy-brown-dark">
              "{activeGreeting.text}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons: Greet Spirit, Reset Camera & Fullscreen */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <button
          type="button"
          onClick={() => handleGreetSpirit?.()}
          disabled={spiritGreetingPending}
          title="Greet your Study Companion"
          aria-label="Greet your Study Companion"
          className="touch-target px-3 py-1.5 bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white text-xs font-pixel rounded border-2 border-cozy-brown-dark shadow-pixel-sm transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-cozy-brown-dark cursor-pointer"
        >
          <span className={spiritGreetingPending ? "animate-spin" : ""} aria-hidden="true">✨</span>
          <span>{spiritGreetingPending ? 'Greeting...' : 'Greet Spirit'}</span>
        </button>

        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Camera View to default perspective"
          aria-label="Reset Camera View to Default"
          className="touch-target px-3 py-1.5 bg-cozy-card hover:bg-cozy-parchment text-cozy-brown-dark text-xs font-pixel rounded border-2 border-cozy-brown-dark shadow-pixel-sm transition active:scale-95 focus-visible:outline-2 focus-visible:outline-cozy-brown-dark cursor-pointer"
        >
          <span aria-hidden="true">🎯</span>
          <span className="ml-1 hidden sm:inline">Reset View</span>
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen mode (Esc)' : 'Expand 3D Room to Full Screen'}
          aria-label={isFullscreen ? 'Exit Fullscreen 3D View' : 'Expand 3D room to full screen'}
          className={`touch-target px-3 py-1.5 font-pixel text-xs rounded border-2 border-cozy-brown-dark shadow-pixel-sm transition active:scale-95 flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-cozy-brown-dark cursor-pointer ${
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
      <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none px-4 z-10">
        <span className="inline-block px-3.5 py-1.5 bg-cozy-card/90 backdrop-blur-sm text-cozy-brown-medium text-[11px] font-pixel rounded-full border border-cozy-border shadow-sm">
          {placingItem
            ? '🎯 Move over floor to position • Click to place • Esc to cancel'
            : '🖱️ Drag to orbit • Scroll to zoom • Drag placed items to move • Press F for Fullscreen'}
        </span>
      </div>
    </div>
  );
}

export default RoomCanvas;
