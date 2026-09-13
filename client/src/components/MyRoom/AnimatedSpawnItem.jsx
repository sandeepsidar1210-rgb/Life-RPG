import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * AnimatedSpawnItem
 * Smoothly scales items up from 0 with a juicy elastic spring bounce when equipped,
 * and scales them smoothly back to 0 when unequipped.
 */
export function AnimatedSpawnItem({
  isEquipped = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scaleMultiplier = 1,
  children
}) {
  const groupRef = useRef();
  const currentScale = useRef(isEquipped ? 1 : 0);
  const velocity = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Cap delta to prevent crazy physics jumps on tab blur
    const dt = Math.min(delta, 0.05);

    const targetScale = isEquipped ? 1 : 0;
    const stiffness = 220; // snappier spring
    const damping = 16;    // slight overshoot bounce

    const displacement = currentScale.current - targetScale;
    const springForce = -stiffness * displacement - damping * velocity.current;
    
    velocity.current += springForce * dt;
    currentScale.current += velocity.current * dt;

    // Clamp small numbers near zero
    if (!isEquipped && currentScale.current < 0.005 && Math.abs(velocity.current) < 0.01) {
      currentScale.current = 0;
      velocity.current = 0;
    }

    const s = Math.max(0, currentScale.current) * scaleMultiplier;
    groupRef.current.scale.set(s, s, s);

    // Hide from render queue when completely unequipped & scale is 0
    groupRef.current.visible = currentScale.current > 0.001;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      visible={isEquipped}
    >
      {children}
    </group>
  );
}
