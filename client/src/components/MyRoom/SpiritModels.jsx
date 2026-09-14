import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

// Stylized low-poly flat-shaded material
const FlatMat = ({ color, roughness = 0.7, metalness = 0.1, emissive, emissiveIntensity = 1, transparent = false, opacity = 1 }) => (
  <meshStandardMaterial
    color={color}
    roughness={roughness}
    metalness={metalness}
    flatShading={true}
    emissive={emissive}
    emissiveIntensity={emissiveIntensity}
    transparent={transparent}
    opacity={opacity}
  />
);

// ==============================================================================
// 1. EMBERWISP (Focus Spirit - Enhanced 3D Fidelity)
// ==============================================================================

// Stage 1: Emberwisp Spark — Tiny flickering flame wisp with orbiting embers
export function EmberwispSpark() {
  const groupRef = useRef();
  const auraRef = useRef();
  const hazeRef = useRef();
  const sparkRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];
  const trailRefs = [useRef(), useRef(), useRef()];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Smooth eased bobbing (cubic ease-in-out feel)
    if (groupRef.current) {
      const raw = Math.sin(t * 2.8);
      const eased = raw * raw * raw * 0.3 + raw * 0.7;
      groupRef.current.position.y = eased * 0.1;
      groupRef.current.rotation.y = t * 0.7;
    }
    // Pulsing aura
    if (auraRef.current) {
      const pulse = 1 + Math.sin(t * 3.8) * 0.1;
      auraRef.current.scale.set(pulse, pulse * 1.08, pulse);
    }
    // Outer heat-haze ring
    if (hazeRef.current) {
      hazeRef.current.rotation.z = t * 0.5;
      const hazePulse = 1 + Math.sin(t * 2.2) * 0.15;
      hazeRef.current.scale.set(hazePulse, hazePulse, hazePulse);
    }
    // 5 orbiting ember sparks
    sparkRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const angle = t * (3.0 + i * 0.4) + (i * Math.PI * 2) / 5;
      const radius = 0.28 + i * 0.04;
      ref.current.position.x = Math.sin(angle) * radius;
      ref.current.position.z = Math.cos(angle) * radius;
      ref.current.position.y = 0.2 + Math.sin(t * (4 + i * 0.6) + i) * 0.12;
    });
    // Upward drifting trail embers
    trailRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const phase = (t * 0.8 + i * 1.2) % 2.5;
      ref.current.position.y = 0.5 + phase * 0.35;
      ref.current.position.x = Math.sin(t * 1.5 + i * 2) * 0.08;
      const fade = Math.max(0, 1 - phase / 2.5);
      ref.current.scale.setScalar(fade * 0.8 + 0.2);
      if (ref.current.material) ref.current.material.opacity = fade * 0.7;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Outer Heat-Haze Distortion Ring */}
      <group ref={hazeRef} position={[0, 0.24, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.025, 8, 20]} />
          <FlatMat color="#FF8A65" emissive="#FF5722" emissiveIntensity={0.8} transparent opacity={0.2} />
        </mesh>
      </group>
      {/* Soft Outer Flame Aura */}
      <mesh ref={auraRef} position={[0, 0.24, 0]}>
        <sphereGeometry args={[0.28, 16, 14]} />
        <FlatMat color="#FF7043" emissive="#F4511E" emissiveIntensity={1.4} transparent opacity={0.3} />
      </mesh>
      {/* Central Vibrant Flame Core — layered for depth */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.2, 16, 14]} />
        <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={2.2} />
      </mesh>
      {/* Inner White-Hot Nucleus */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.12, 12, 10]} />
        <FlatMat color="#FFFDE7" emissive="#FFF59D" emissiveIntensity={3.8} />
      </mesh>
      {/* Flame Tip Teardrop Crown with bevel */}
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.14, 0.3, 12]} />
        <FlatMat color="#FB8C00" emissive="#F57C00" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <coneGeometry args={[0.08, 0.15, 10]} />
        <FlatMat color="#FFF9C4" emissive="#FFD54F" emissiveIntensity={3.0} />
      </mesh>
      {/* Curved Flame Winglets — left & right */}
      <mesh position={[-0.2, 0.24, 0]} rotation={[0, 0, Math.PI / 5]}>
        <coneGeometry args={[0.07, 0.24, 8]} />
        <FlatMat color="#FF7043" emissive="#FF5722" emissiveIntensity={1.8} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0.2, 0.24, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <coneGeometry args={[0.07, 0.24, 8]} />
        <FlatMat color="#FF7043" emissive="#FF5722" emissiveIntensity={1.8} transparent opacity={0.75} />
      </mesh>
      {/* Friendly Glowing Eyes */}
      <mesh position={[-0.065, 0.22, 0.18]}>
        <sphereGeometry args={[0.038, 10, 8]} />
        <FlatMat color="#2B1608" />
      </mesh>
      <mesh position={[0.065, 0.22, 0.18]}>
        <sphereGeometry args={[0.038, 10, 8]} />
        <FlatMat color="#2B1608" />
      </mesh>
      {/* Eye glint highlights */}
      <mesh position={[-0.058, 0.235, 0.2]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <FlatMat color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.058, 0.235, 0.2]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <FlatMat color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
      </mesh>
      {/* 5 Orbiting Ember Sparks */}
      {sparkRefs.map((ref, i) => (
        <mesh key={`spark-${i}`} ref={ref}>
          {i % 2 === 0
            ? <sphereGeometry args={[0.032 + i * 0.004, 8, 6]} />
            : <octahedronGeometry args={[0.035 + i * 0.003]} />
          }
          <FlatMat
            color={i % 2 === 0 ? '#FFE082' : '#FFB74D'}
            emissive={i % 2 === 0 ? '#FFD54F' : '#FFA726'}
            emissiveIntensity={2.5 + i * 0.3}
          />
        </mesh>
      ))}
      {/* Upward Drifting Trail Embers */}
      {trailRefs.map((ref, i) => (
        <mesh key={`trail-${i}`} ref={ref} position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#FFCC80" transparent opacity={0.6} />
        </mesh>
      ))}
      <pointLight color="#FF9800" intensity={1.8} distance={5.5} />
    </group>
  );
}

// Stage 2: Emberwisp Lantern (Intricate Pagoda Brass Filigree + Inner Flame Effects)
export function EmberwispLantern() {
  const groupRef = useRef();
  const wingLRef = useRef();
  const wingRRef = useRef();
  const flameRef = useRef();
  const emberRingRef = useRef();
  const innerParticleRefs = [useRef(), useRef(), useRef(), useRef()];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Smooth eased bob
    if (groupRef.current) {
      const raw = Math.sin(t * 2.2);
      const eased = raw * raw * raw * 0.25 + raw * 0.75;
      groupRef.current.position.y = eased * 0.12;
      groupRef.current.rotation.y = Math.sin(t * 0.55) * 0.38;
    }
    // Wing flap with secondary oscillation
    if (wingLRef.current) {
      wingLRef.current.rotation.z = -0.3 + Math.sin(t * 5.0) * 0.28 + Math.sin(t * 8.5) * 0.08;
    }
    if (wingRRef.current) {
      wingRRef.current.rotation.z = 0.3 - Math.sin(t * 5.0) * 0.28 - Math.sin(t * 8.5) * 0.08;
    }
    // Inner flame core pulse
    if (flameRef.current) {
      const pulse = 1 + Math.sin(t * 4.5) * 0.12;
      flameRef.current.scale.set(pulse, pulse * 1.15, pulse);
    }
    // Rotating ember ring around lantern body
    if (emberRingRef.current) {
      emberRingRef.current.rotation.y = t * 2.4;
      emberRingRef.current.rotation.x = Math.sin(t * 0.8) * 0.2;
    }
    // Inner flicker particles
    innerParticleRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const angle = t * (3.5 + i * 0.8) + (i * Math.PI) / 2;
      const r = 0.1 + Math.sin(t * 2 + i) * 0.04;
      ref.current.position.x = Math.sin(angle) * r;
      ref.current.position.z = Math.cos(angle) * r;
      ref.current.position.y = 0.34 + Math.sin(t * (5 + i)) * 0.06;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Tiered Hexagonal Pagoda Roof with Swept Eaves */}
      <group position={[0, 0.64, 0]}>
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.32, 0.14, 6]} />
          <FlatMat color="#D4AF37" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.14, 0.1, 6]} />
          <FlatMat color="#B58F28" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Upturned Eave Finials */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI) / 3;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.34, 0.08, Math.sin(angle) * 0.34]}
              rotation={[0, -angle, 0.5]}
              castShadow
            >
              <coneGeometry args={[0.03, 0.12, 5]} />
              <FlatMat color="#DFB659" metalness={0.85} roughness={0.2} />
            </mesh>
          );
        })}
        {/* Top Brass Suspension Ring */}
        <mesh position={[0, 0.24, 0]}>
          <torusGeometry args={[0.08, 0.022, 10, 18]} />
          <FlatMat color="#DFB659" metalness={0.8} />
        </mesh>
      </group>

      {/* 6 Slender Brass Filigree Vertical Posts */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        return (
          <mesh
            key={`post-${i}`}
            position={[Math.cos(angle) * 0.24, 0.34, Math.sin(angle) * 0.24]}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 0.52, 8]} />
            <FlatMat color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Filigree Horizontal Cross-Braces Between Posts */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle1 = (i * Math.PI) / 3;
        const angle2 = ((i + 1) * Math.PI) / 3;
        const x1 = Math.cos(angle1) * 0.24;
        const z1 = Math.sin(angle1) * 0.24;
        const x2 = Math.cos(angle2) * 0.24;
        const z2 = Math.sin(angle2) * 0.24;
        const midX = (x1 + x2) / 2;
        const midZ = (z1 + z2) / 2;
        const dx = x2 - x1;
        const dz = z2 - z1;
        const len = Math.sqrt(dx * dx + dz * dz);
        const rotY = Math.atan2(dx, dz);
        return (
          <group key={`brace-${i}`}>
            {/* Upper brace */}
            <mesh position={[midX, 0.50, midZ]} rotation={[0, rotY, 0]}>
              <boxGeometry args={[0.015, 0.015, len]} />
              <FlatMat color="#C9A030" metalness={0.75} roughness={0.25} />
            </mesh>
            {/* Lower brace */}
            <mesh position={[midX, 0.18, midZ]} rotation={[0, rotY, 0]}>
              <boxGeometry args={[0.015, 0.015, len]} />
              <FlatMat color="#C9A030" metalness={0.75} roughness={0.25} />
            </mesh>
            {/* Decorative diagonal */}
            <mesh position={[midX, 0.34, midZ]} rotation={[0, rotY, Math.PI / 4]}>
              <boxGeometry args={[0.01, 0.28, 0.01]} />
              <FlatMat color="#B58F28" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        );
      })}

      {/* Hexagonal Moulded Plinth Base */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.3, 0.09, 6]} />
        <FlatMat color="#B58F28" metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.04, 6]} />
        <FlatMat color="#8C6D1F" metalness={0.7} />
      </mesh>
      {/* Decorative base torus ring */}
      <mesh position={[0, 0.10, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.27, 0.012, 8, 12]} />
        <FlatMat color="#DFB659" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Inner Living Spirit Flame Core */}
      <group ref={flameRef} position={[0, 0.34, 0]}>
        {/* Main flame */}
        <mesh>
          <sphereGeometry args={[0.16, 16, 14]} />
          <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={3.0} />
        </mesh>
        {/* Inner hot nucleus */}
        <mesh>
          <sphereGeometry args={[0.09, 12, 10]} />
          <FlatMat color="#FFFDE7" emissive="#FFF59D" emissiveIntensity={4.0} />
        </mesh>
        {/* Flame tip */}
        <mesh position={[0, 0.14, 0]}>
          <coneGeometry args={[0.1, 0.22, 12]} />
          <FlatMat color="#FFF7C2" emissive="#FFEB3B" emissiveIntensity={3.8} />
        </mesh>
        {/* Bright Joyful Eyes */}
        <mesh position={[-0.058, 0.03, 0.14]}>
          <sphereGeometry args={[0.03, 10, 8]} />
          <FlatMat color="#2B1608" />
        </mesh>
        <mesh position={[0.058, 0.03, 0.14]}>
          <sphereGeometry args={[0.03, 10, 8]} />
          <FlatMat color="#2B1608" />
        </mesh>
        {/* Eye glints */}
        <mesh position={[-0.05, 0.042, 0.16]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <FlatMat color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.05, 0.042, 0.16]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <FlatMat color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Inner Flicker Particles inside cage */}
      {innerParticleRefs.map((ref, i) => (
        <mesh key={`flicker-${i}`} ref={ref} position={[0, 0.34, 0]}>
          <sphereGeometry args={[0.018 + i * 0.003, 6, 6]} />
          <FlatMat
            color={i % 2 === 0 ? '#FFE082' : '#FFCC80'}
            emissive={i % 2 === 0 ? '#FFD54F' : '#FFB74D'}
            emissiveIntensity={3}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Rotating Ember Ring orbiting lantern */}
      <group ref={emberRingRef} position={[0, 0.34, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i * Math.PI * 2) / 6;
          return (
            <mesh key={`ember-ring-${i}`} position={[Math.cos(a) * 0.38, 0, Math.sin(a) * 0.38]}>
              <octahedronGeometry args={[0.025]} />
              <FlatMat color="#FFD54F" emissive="#FFA000" emissiveIntensity={3} />
            </mesh>
          );
        })}
      </group>

      {/* Delicate Flame Winglets */}
      <group ref={wingLRef} position={[-0.28, 0.38, 0]}>
        <mesh rotation={[0, 0, Math.PI / 3.5]}>
          <coneGeometry args={[0.1, 0.42, 8]} />
          <FlatMat color="#FF7043" emissive="#F4511E" emissiveIntensity={2.6} transparent opacity={0.85} />
        </mesh>
        <mesh position={[-0.12, 0.12, 0]} rotation={[0, 0, Math.PI / 2.8]}>
          <coneGeometry args={[0.05, 0.22, 6]} />
          <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={2.0} transparent opacity={0.6} />
        </mesh>
      </group>
      <group ref={wingRRef} position={[0.28, 0.38, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 3.5]}>
          <coneGeometry args={[0.1, 0.42, 8]} />
          <FlatMat color="#FF7043" emissive="#F4511E" emissiveIntensity={2.6} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0.12, 0.12, 0]} rotation={[0, 0, -Math.PI / 2.8]}>
          <coneGeometry args={[0.05, 0.22, 6]} />
          <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={2.0} transparent opacity={0.6} />
        </mesh>
      </group>
      <pointLight color="#FFA726" intensity={2.8} distance={7.5} position={[0, 0.34, 0]} />
    </group>
  );
}

// Stage 3: Emberwisp Pyrespirit (Celestial Dragonling — Major Evolution Jump)
export function EmberwispPyrespirit() {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const tailRef = useRef();
  const tailSeg2Ref = useRef();
  const tailSeg3Ref = useRef();
  const wingLRef = useRef();
  const wingRRef = useRef();
  const crownRef = useRef();
  const constellationRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Majestic eased bobbing flight
    if (groupRef.current) {
      const raw = Math.sin(t * 1.8);
      const eased = raw * raw * raw * 0.3 + raw * 0.7;
      groupRef.current.position.y = eased * 0.15;
      groupRef.current.rotation.y = Math.sin(t * 0.7) * 0.45;
    }
    // Layered wing flaps with drag
    if (wingLRef.current) {
      wingLRef.current.rotation.z = 0.2 + Math.sin(t * 4.0) * 0.42 + Math.sin(t * 7.2) * 0.12;
      wingLRef.current.rotation.y = Math.cos(t * 4.0) * 0.22;
    }
    if (wingRRef.current) {
      wingRRef.current.rotation.z = -0.2 - Math.sin(t * 4.0) * 0.42 - Math.sin(t * 7.2) * 0.12;
      wingRRef.current.rotation.y = -Math.cos(t * 4.0) * 0.22;
    }
    // 3 counter-rotating celestial rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 1.4;
      ring1Ref.current.rotation.z = t * 2.0;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 1.6;
      ring2Ref.current.rotation.x = -t * 1.0;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 1.2;
      ring3Ref.current.rotation.y = t * 0.8;
    }
    // Cascading flame tail sway (each segment delayed)
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 2.8) * 0.5;
    }
    if (tailSeg2Ref.current) {
      tailSeg2Ref.current.rotation.y = Math.sin(t * 2.8 - 0.4) * 0.4;
    }
    if (tailSeg3Ref.current) {
      tailSeg3Ref.current.rotation.y = Math.sin(t * 2.8 - 0.8) * 0.35;
    }
    // Crown flame flicker
    if (crownRef.current) {
      const cp = 1 + Math.sin(t * 6) * 0.15;
      crownRef.current.scale.set(cp, cp * 1.2, cp);
    }
    // Orbiting star constellation
    if (constellationRef.current) {
      constellationRef.current.rotation.y = t * 1.0;
      constellationRef.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={1.25}>
      {/* === Segmented Dragon Torso (organic multi-segment body) === */}
      {/* Upper torso */}
      <mesh position={[0, 0.56, 0]}>
        <sphereGeometry args={[0.23, 12, 10]} />
        <FlatMat color="#E65100" emissive="#BF360C" emissiveIntensity={1.4} />
      </mesh>
      {/* Mid torso */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.2, 12, 10]} />
        <FlatMat color="#D84315" emissive="#BF360C" emissiveIntensity={1.2} />
      </mesh>
      {/* Lower torso */}
      <mesh position={[0, 0.24, 0]}>
        <sphereGeometry args={[0.17, 10, 8]} />
        <FlatMat color="#BF360C" emissive="#8D2B0B" emissiveIntensity={1.0} />
      </mesh>
      {/* Connecting torso cylinder */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.18, 0.42, 10]} />
        <FlatMat color="#E65100" emissive="#BF360C" emissiveIntensity={1.3} />
      </mesh>

      {/* Tiered Radiant Chest Plate with layered armor */}
      <mesh position={[0, 0.54, 0.14]}>
        <boxGeometry args={[0.22, 0.3, 0.08]} />
        <FlatMat color="#FFD54F" emissive="#FFA000" emissiveIntensity={3.0} />
      </mesh>
      <mesh position={[0, 0.54, 0.18]}>
        <boxGeometry args={[0.16, 0.2, 0.04]} />
        <FlatMat color="#FFF9C4" emissive="#FFD54F" emissiveIntensity={3.5} />
      </mesh>
      <mesh position={[0, 0.38, 0.13]}>
        <coneGeometry args={[0.12, 0.18, 4]} />
        <FlatMat color="#FFF9C4" emissive="#FFD54F" emissiveIntensity={3.2} />
      </mesh>

      {/* === Dragon Head with Horns & Crown === */}
      <group position={[0, 0.82, 0.08]}>
        {/* Rounded head */}
        <mesh>
          <sphereGeometry args={[0.17, 12, 10]} />
          <FlatMat color="#F57C00" emissive="#E65100" emissiveIntensity={1.6} />
        </mesh>
        {/* Snout extension */}
        <mesh position={[0, -0.04, 0.14]}>
          <boxGeometry args={[0.18, 0.14, 0.16]} />
          <FlatMat color="#EF6C00" emissive="#E65100" emissiveIntensity={1.4} />
        </mesh>
        {/* Rounded brow ridge */}
        <mesh position={[0, 0.08, 0.08]}>
          <sphereGeometry args={[0.14, 10, 6]} />
          <FlatMat color="#E65100" emissive="#BF360C" emissiveIntensity={1.2} />
        </mesh>
        {/* Golden Swept Antler Horns */}
        <mesh position={[-0.15, 0.2, -0.08]} rotation={[-0.4, 0, -0.52]}>
          <coneGeometry args={[0.045, 0.4, 8]} />
          <FlatMat color="#FFD700" metalness={0.75} roughness={0.25} emissive="#FFA000" emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[0.15, 0.2, -0.08]} rotation={[-0.4, 0, 0.52]}>
          <coneGeometry args={[0.045, 0.4, 8]} />
          <FlatMat color="#FFD700" metalness={0.75} roughness={0.25} emissive="#FFA000" emissiveIntensity={1.8} />
        </mesh>
        {/* Secondary inner horns */}
        <mesh position={[-0.08, 0.18, -0.04]} rotation={[-0.3, 0, -0.35]}>
          <coneGeometry args={[0.025, 0.2, 6]} />
          <FlatMat color="#FFC107" metalness={0.7} emissive="#FF8F00" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0.08, 0.18, -0.04]} rotation={[-0.3, 0, 0.35]}>
          <coneGeometry args={[0.025, 0.2, 6]} />
          <FlatMat color="#FFC107" metalness={0.7} emissive="#FF8F00" emissiveIntensity={1.5} />
        </mesh>
        {/* Crown Flame Crest */}
        <group ref={crownRef} position={[0, 0.28, 0]}>
          <mesh>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <FlatMat color="#FF5722" emissive="#E64A19" emissiveIntensity={3.0} />
          </mesh>
          <mesh position={[-0.06, -0.02, 0]} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.04, 0.14, 6]} />
            <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={2.5} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.06, -0.02, 0]} rotation={[0, 0, -0.3]}>
            <coneGeometry args={[0.04, 0.14, 6]} />
            <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={2.5} transparent opacity={0.8} />
          </mesh>
        </group>
        {/* Blazing Starlight Dragon Eyes — larger and more luminous */}
        <mesh position={[-0.09, 0.04, 0.16]}>
          <sphereGeometry args={[0.042, 10, 8]} />
          <FlatMat color="#FFFDE7" emissive="#FFFFFF" emissiveIntensity={4.0} />
        </mesh>
        <mesh position={[0.09, 0.04, 0.16]}>
          <sphereGeometry args={[0.042, 10, 8]} />
          <FlatMat color="#FFFDE7" emissive="#FFFFFF" emissiveIntensity={4.0} />
        </mesh>
        {/* Eye pupils */}
        <mesh position={[-0.085, 0.04, 0.2]}>
          <sphereGeometry args={[0.02, 8, 6]} />
          <FlatMat color="#E65100" emissive="#BF360C" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.085, 0.04, 0.2]}>
          <sphereGeometry args={[0.02, 8, 6]} />
          <FlatMat color="#E65100" emissive="#BF360C" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* === Layered Feathered Flame Wings === */}
      <group ref={wingLRef} position={[-0.22, 0.58, -0.05]}>
        {/* Primary outer wing feathers */}
        <mesh position={[-0.3, 0.2, 0]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.16, 0.7, 8]} />
          <FlatMat color="#FF5722" emissive="#E64A19" emissiveIntensity={2.8} transparent opacity={0.88} />
        </mesh>
        {/* Secondary inner feathers */}
        <mesh position={[-0.18, 0.14, 0]} rotation={[0, 0, 0.4]}>
          <coneGeometry args={[0.1, 0.5, 6]} />
          <FlatMat color="#FF7043" emissive="#FF5722" emissiveIntensity={2.2} transparent opacity={0.75} />
        </mesh>
        {/* Tertiary tips */}
        <mesh position={[-0.48, 0.38, 0]} rotation={[0, 0, 0.7]}>
          <coneGeometry args={[0.08, 0.42, 6]} />
          <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={3.0} transparent opacity={0.82} />
        </mesh>
        {/* Trailing wisps */}
        <mesh position={[-0.55, 0.48, 0]} rotation={[0, 0, 0.9]}>
          <coneGeometry args={[0.04, 0.25, 6]} />
          <FlatMat color="#FFE082" emissive="#FFD54F" emissiveIntensity={2.5} transparent opacity={0.6} />
        </mesh>
      </group>
      <group ref={wingRRef} position={[0.22, 0.58, -0.05]}>
        <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.16, 0.7, 8]} />
          <FlatMat color="#FF5722" emissive="#E64A19" emissiveIntensity={2.8} transparent opacity={0.88} />
        </mesh>
        <mesh position={[0.18, 0.14, 0]} rotation={[0, 0, -0.4]}>
          <coneGeometry args={[0.1, 0.5, 6]} />
          <FlatMat color="#FF7043" emissive="#FF5722" emissiveIntensity={2.2} transparent opacity={0.75} />
        </mesh>
        <mesh position={[0.48, 0.38, 0]} rotation={[0, 0, -0.7]}>
          <coneGeometry args={[0.08, 0.42, 6]} />
          <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={3.0} transparent opacity={0.82} />
        </mesh>
        <mesh position={[0.55, 0.48, 0]} rotation={[0, 0, -0.9]}>
          <coneGeometry args={[0.04, 0.25, 6]} />
          <FlatMat color="#FFE082" emissive="#FFD54F" emissiveIntensity={2.5} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* === Triple Interlocking Celestial Golden Rings === */}
      <group ref={ring1Ref} position={[0, 0.54, 0]}>
        <mesh rotation={[Math.PI / 3.2, 0, 0]}>
          <torusGeometry args={[0.48, 0.025, 10, 32]} />
          <FlatMat color="#FFD700" metalness={0.85} emissive="#FFA000" emissiveIntensity={2.6} />
        </mesh>
      </group>
      <group ref={ring2Ref} position={[0, 0.54, 0]}>
        <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
          <torusGeometry args={[0.54, 0.022, 10, 32]} />
          <FlatMat color="#FFE082" metalness={0.9} emissive="#FFB300" emissiveIntensity={2.2} />
        </mesh>
      </group>
      <group ref={ring3Ref} position={[0, 0.54, 0]}>
        <mesh rotation={[Math.PI / 6, -Math.PI / 5, Math.PI / 4]}>
          <torusGeometry args={[0.6, 0.018, 8, 28]} />
          <FlatMat color="#FFF9C4" metalness={0.85} emissive="#FFD54F" emissiveIntensity={1.8} transparent opacity={0.75} />
        </mesh>
      </group>

      {/* === Cascading Flame Tail (3-segment chain) === */}
      <group ref={tailRef} position={[0, 0.2, -0.16]}>
        <mesh rotation={[0.6, 0, 0]}>
          <coneGeometry args={[0.14, 0.48, 10]} />
          <FlatMat color="#FF7043" emissive="#D84315" emissiveIntensity={2.2} />
        </mesh>
        <group ref={tailSeg2Ref} position={[0, -0.22, -0.18]}>
          <mesh rotation={[0.4, 0, 0]}>
            <coneGeometry args={[0.1, 0.38, 8]} />
            <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={2.8} />
          </mesh>
          <group ref={tailSeg3Ref} position={[0, -0.18, -0.14]}>
            <mesh rotation={[0.25, 0, 0]}>
              <coneGeometry args={[0.06, 0.3, 8]} />
              <FlatMat color="#FFE082" emissive="#FFEE58" emissiveIntensity={3.5} />
            </mesh>
            {/* Final tail tip wisp */}
            <mesh position={[0, -0.18, -0.08]} rotation={[0.15, 0, 0]}>
              <coneGeometry args={[0.03, 0.18, 6]} />
              <FlatMat color="#FFF9C4" emissive="#FFF176" emissiveIntensity={4.0} transparent opacity={0.7} />
            </mesh>
          </group>
        </group>
      </group>

      {/* === Orbiting Star-Ember Constellation === */}
      <group ref={constellationRef} position={[0, 0.6, 0]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i * Math.PI * 2) / 8;
          const r = 0.72 + (i % 2) * 0.1;
          const y = (i % 3 - 1) * 0.12;
          return (
            <mesh key={`star-${i}`} position={[Math.cos(a) * r, y, Math.sin(a) * r]}>
              <octahedronGeometry args={[0.028 + (i % 3) * 0.008]} />
              <FlatMat
                color={i % 2 === 0 ? '#FFE082' : '#FFCC80'}
                emissive={i % 2 === 0 ? '#FFD54F' : '#FFA726'}
                emissiveIntensity={3.5}
              />
            </mesh>
          );
        })}
      </group>

      <pointLight color="#FF9800" intensity={4.0} distance={10} position={[0, 0.54, 0]} />
    </group>
  );
}


// ==============================================================================
// 2. ROOTLING (Discipline Spirit)
// ==============================================================================

// Stage 1: Rootling Pebble
export function RootlingPebble() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.scale.y = 1 + Math.sin(t * 2.2) * 0.04;
      groupRef.current.rotation.y = Math.sin(t * 1.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Smooth River Stone Body */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.26, 10, 8]} />
        <FlatMat color="#4B5563" roughness={0.9} />
      </mesh>
      {/* Moss Patch Cap */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.18, 8, 6]} />
        <FlatMat color="#588157" roughness={0.95} />
      </mesh>
      {/* Glowing Curious Stone Eyes */}
      <mesh position={[-0.08, 0.24, 0.22]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <FlatMat color="#2DD4BF" emissive="#14B8A6" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.08, 0.24, 0.22]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <FlatMat color="#2DD4BF" emissive="#14B8A6" emissiveIntensity={2.5} />
      </mesh>
      {/* 2 Stubby Stone Feet */}
      <mesh position={[-0.12, 0.05, 0.04]}>
        <boxGeometry args={[0.1, 0.08, 0.14]} />
        <FlatMat color="#374151" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, 0.05, 0.04]}>
        <boxGeometry args={[0.1, 0.08, 0.14]} />
        <FlatMat color="#374151" roughness={0.9} />
      </mesh>
      {/* Tiny sprout on top of moss */}
      <group position={[0, 0.54, 0]}>
        <mesh position={[0.03, 0.04, 0]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.015, 0.015, 0.08, 6]} />
          <FlatMat color="#A7F3D0" />
        </mesh>
        <mesh position={[0.06, 0.08, 0]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <FlatMat color="#34D399" />
        </mesh>
      </group>
    </group>
  );
}

// Stage 2: Rootling Runeguard
export function RootlingRuneguard() {
  const runeFloatRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (runeFloatRef.current) {
      runeFloatRef.current.position.y = 0.48 + Math.sin(t * 3) * 0.05;
      runeFloatRef.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group>
      {/* Carved Granite Torso */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.42, 0.44, 0.34]} />
        <FlatMat color="#4B5563" roughness={0.8} />
      </mesh>
      {/* Glowing Turquoise Runic Carvings on Torso */}
      <mesh position={[0, 0.38, 0.175]}>
        <boxGeometry args={[0.22, 0.04, 0.01]} />
        <FlatMat color="#2DD4BF" emissive="#14B8A6" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0, 0.28, 0.175]}>
        <boxGeometry args={[0.14, 0.035, 0.01]} />
        <FlatMat color="#2DD4BF" emissive="#14B8A6" emissiveIntensity={3} />
      </mesh>
      {/* Mossy Stone Shoulders */}
      <mesh position={[-0.26, 0.48, 0]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <FlatMat color="#588157" roughness={0.9} />
      </mesh>
      <mesh position={[0.26, 0.48, 0]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <FlatMat color="#588157" roughness={0.9} />
      </mesh>
      {/* Head with Woody Root Antlers */}
      <group position={[0, 0.72, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 0.24, 0.28]} />
          <FlatMat color="#374151" roughness={0.8} />
        </mesh>
        {/* Glowing Visor Eyes */}
        <mesh position={[-0.07, 0.02, 0.145]}>
          <boxGeometry args={[0.06, 0.04, 0.01]} />
          <FlatMat color="#2DD4BF" emissive="#14B8A6" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.07, 0.02, 0.145]}>
          <boxGeometry args={[0.06, 0.04, 0.01]} />
          <FlatMat color="#2DD4BF" emissive="#14B8A6" emissiveIntensity={3} />
        </mesh>
        {/* Root Antlers */}
        <mesh position={[-0.14, 0.18, 0]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.03, 0.05, 0.26, 6]} />
          <FlatMat color="#3D291C" roughness={0.9} />
        </mesh>
        <mesh position={[0.14, 0.18, 0]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.03, 0.05, 0.26, 6]} />
          <FlatMat color="#3D291C" roughness={0.9} />
        </mesh>
      </group>
      {/* Floating Runic Keystone Orbiting */}
      <mesh ref={runeFloatRef} position={[0, 0.48, 0.28]}>
        <octahedronGeometry args={[0.07, 0]} />
        <FlatMat color="#2DD4BF" emissive="#14B8A6" emissiveIntensity={3} />
      </mesh>
      {/* Sturdy Stone Legs */}
      <mesh position={[-0.14, 0.1, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.18]} />
        <FlatMat color="#374151" roughness={0.9} />
      </mesh>
      <mesh position={[0.14, 0.1, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.18]} />
        <FlatMat color="#374151" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Stage 3: Rootling Colossus
export function RootlingColossus() {
  const orb1Ref = useRef();
  const orb2Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.sin(t * 1.5) * 0.55;
      orb1Ref.current.position.z = Math.cos(t * 1.5) * 0.55;
      orb1Ref.current.rotation.y = t * 2;
    }
    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.sin(t * 1.5 + Math.PI) * 0.55;
      orb2Ref.current.position.z = Math.cos(t * 1.5 + Math.PI) * 0.55;
      orb2Ref.current.rotation.y = t * 2;
    }
  });

  return (
    <group scale={1.1}>
      {/* Megalith Torso with Moss Mantle */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.45]} />
        <FlatMat color="#374151" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.66, 0.16, 0.5]} />
        <FlatMat color="#4E7C47" roughness={0.95} />
      </mesh>
      {/* Torso Runic Heart */}
      <mesh position={[0, 0.5, 0.23]}>
        <octahedronGeometry args={[0.11]} />
        <FlatMat color="#2DD4BF" emissive="#0D9488" emissiveIntensity={3} />
      </mesh>
      {/* Colossus Head with Shrine Cap */}
      <group position={[0, 0.95, 0.05]}>
        <mesh>
          <boxGeometry args={[0.38, 0.28, 0.34]} />
          <FlatMat color="#1F2937" roughness={0.9} />
        </mesh>
        {/* Ancient Glowing Cyan Rune Eyes */}
        <mesh position={[-0.1, 0.02, 0.175]}>
          <boxGeometry args={[0.07, 0.04, 0.01]} />
          <FlatMat color="#2DD4BF" emissive="#14B8A6" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.1, 0.02, 0.175]}>
          <boxGeometry args={[0.07, 0.04, 0.01]} />
          <FlatMat color="#2DD4BF" emissive="#14B8A6" emissiveIntensity={3} />
        </mesh>
        {/* Stone Shrine Pagoda Roof on Head */}
        <mesh position={[0, 0.22, 0]}>
          <coneGeometry args={[0.34, 0.16, 4]} rotation={[0, Math.PI / 4, 0]} />
          <FlatMat color="#4B5563" roughness={0.8} />
        </mesh>
      </group>
      {/* Massive Root-Braced Arms */}
      <mesh position={[-0.42, 0.4, 0]}>
        <boxGeometry args={[0.22, 0.55, 0.24]} />
        <FlatMat color="#374151" />
      </mesh>
      <mesh position={[0.42, 0.4, 0]}>
        <boxGeometry args={[0.22, 0.55, 0.24]} />
        <FlatMat color="#374151" />
      </mesh>
      {/* Orbiting Runic Satellites */}
      <mesh ref={orb1Ref} position={[0, 0.6, 0]}>
        <octahedronGeometry args={[0.08]} />
        <FlatMat color="#2DD4BF" emissive="#14B8A6" emissiveIntensity={2.5} />
      </mesh>
      <mesh ref={orb2Ref} position={[0, 0.6, 0]}>
        <octahedronGeometry args={[0.08]} />
        <FlatMat color="#2DD4BF" emissive="#14B8A6" emissiveIntensity={2.5} />
      </mesh>
      {/* Sturdy Column Legs */}
      <mesh position={[-0.18, 0.12, 0]}>
        <boxGeometry args={[0.22, 0.24, 0.24]} />
        <FlatMat color="#1F2937" />
      </mesh>
      <mesh position={[0.18, 0.12, 0]}>
        <boxGeometry args={[0.22, 0.24, 0.24]} />
        <FlatMat color="#1F2937" />
      </mesh>
    </group>
  );
}

// ==============================================================================
// 3. SPROUTLING (Vitality Spirit)
// ==============================================================================

// Stage 1: Sproutling Seed
export function SproutlingSeed() {
  const groupRef = useRef();
  const sproutRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.abs(Math.sin(t * 3.5)) * 0.12;
      groupRef.current.rotation.y = Math.sin(t * 1.5) * 0.2;
    }
    if (sproutRef.current) {
      sproutRef.current.rotation.y = t * 4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Plump Green Seed Body */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.22, 12, 10]} />
        <FlatMat color="#22C55E" roughness={0.6} />
      </mesh>
      {/* Wooden Acorn Cap */}
      <mesh position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.18, 8, 6]} />
        <FlatMat color="#78350F" roughness={0.8} />
      </mesh>
      {/* Twirling Twin Clover Leaves on Top */}
      <group ref={sproutRef} position={[0, 0.54, 0]}>
        <mesh position={[-0.08, 0.04, 0]} rotation={[0.2, 0, 0.5]}>
          <boxGeometry args={[0.12, 0.02, 0.08]} />
          <FlatMat color="#86EFAC" emissive="#4ADE80" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0.08, 0.04, 0]} rotation={[-0.2, 0, -0.5]}>
          <boxGeometry args={[0.12, 0.02, 0.08]} />
          <FlatMat color="#86EFAC" emissive="#4ADE80" emissiveIntensity={0.6} />
        </mesh>
      </group>
      {/* Cheerful Dark Eyes and Rosy Cheeks */}
      <mesh position={[-0.07, 0.24, 0.19]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <FlatMat color="#14532D" />
      </mesh>
      <mesh position={[0.07, 0.24, 0.19]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <FlatMat color="#14532D" />
      </mesh>
      <mesh position={[-0.11, 0.18, 0.17]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <FlatMat color="#F472B6" />
      </mesh>
      <mesh position={[0.11, 0.18, 0.17]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <FlatMat color="#F472B6" />
      </mesh>
    </group>
  );
}

// Stage 2: Sproutling Bloom
export function SproutlingBloom() {
  const groupRef = useRef();
  const petalWingL = useRef();
  const petalWingR = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 3) * 0.08;
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.3;
    }
    if (petalWingL.current) petalWingL.current.rotation.y = Math.sin(t * 6) * 0.35;
    if (petalWingR.current) petalWingR.current.rotation.y = -Math.sin(t * 6) * 0.35;
  });

  return (
    <group ref={groupRef}>
      {/* Slender Vine Sprite Body */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.12, 0.08, 0.38, 8]} />
        <FlatMat color="#16A34A" roughness={0.6} />
      </mesh>
      {/* Blooming Flower Petal Collar */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.18, 0.44, Math.sin(angle) * 0.18]}
            rotation={[0.3, angle, 0]}
          >
            <sphereGeometry args={[0.07, 8, 6]} />
            <FlatMat color="#F472B6" emissive="#EC4899" emissiveIntensity={0.8} />
          </mesh>
        );
      })}
      {/* Head */}
      <mesh position={[0, 0.58, 0]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        <FlatMat color="#BBF7D0" roughness={0.7} />
      </mesh>
      {/* Gentle Green Eyes */}
      <mesh position={[-0.05, 0.58, 0.14]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <FlatMat color="#14532D" />
      </mesh>
      <mesh position={[0.05, 0.58, 0.14]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <FlatMat color="#14532D" />
      </mesh>
      {/* Leaf Petal Wings */}
      <group ref={petalWingL} position={[-0.14, 0.38, -0.05]}>
        <mesh rotation={[0, -0.3, -0.4]}>
          <boxGeometry args={[0.26, 0.12, 0.02]} />
          <FlatMat color="#86EFAC" transparent opacity={0.85} emissive="#4ADE80" emissiveIntensity={0.5} />
        </mesh>
      </group>
      <group ref={petalWingR} position={[0.14, 0.38, -0.05]}>
        <mesh rotation={[0, 0.3, 0.4]}>
          <boxGeometry args={[0.26, 0.12, 0.02]} />
          <FlatMat color="#86EFAC" transparent opacity={0.85} emissive="#4ADE80" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// Stage 3: Sproutling Dryad
export function SproutlingDryad() {
  const haloRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (haloRef.current) {
      haloRef.current.rotation.y = t * 1.2;
      haloRef.current.position.y = 0.88 + Math.sin(t * 2) * 0.04;
    }
  });

  return (
    <group scale={1.15}>
      {/* Living Cherry Blossom Wood Torso */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.16, 0.12, 0.52, 8]} />
        <FlatMat color="#78350F" roughness={0.8} />
      </mesh>
      {/* Cascading Emerald Foliage Robe */}
      <mesh position={[0, 0.32, 0]}>
        <coneGeometry args={[0.3, 0.45, 8]} />
        <FlatMat color="#15803D" roughness={0.7} />
      </mesh>
      {/* Dryad Head with Sakura Antlers */}
      <group position={[0, 0.78, 0]}>
        <mesh>
          <sphereGeometry args={[0.18, 10, 8]} />
          <FlatMat color="#DCFCE7" roughness={0.6} />
        </mesh>
        {/* Antler Branches */}
        <mesh position={[-0.18, 0.22, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.03, 0.045, 0.36, 6]} />
          <FlatMat color="#5C3A21" />
        </mesh>
        <mesh position={[0.18, 0.22, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.03, 0.045, 0.36, 6]} />
          <FlatMat color="#5C3A21" />
        </mesh>
        {/* Sakura Blossom Clusters on Antlers */}
        {[-0.24, -0.16, 0.16, 0.24].map((px, idx) => (
          <mesh key={idx} position={[px, 0.36, 0]}>
            <sphereGeometry args={[0.07, 8, 6]} />
            <FlatMat color="#F472B6" emissive="#EC4899" emissiveIntensity={1} />
          </mesh>
        ))}
      </group>
      {/* Orbiting Emerald Leaf Halo Ring */}
      <group ref={haloRef} position={[0, 0.88, 0]}>
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[0.38, 0.02, 8, 24]} />
          <FlatMat color="#4ADE80" emissive="#22C55E" emissiveIntensity={2} />
        </mesh>
      </group>
      <pointLight color="#86EFAC" intensity={2} distance={6} position={[0, 0.6, 0]} />
    </group>
  );
}

// ==============================================================================
// 4. INKLING (Creativity Spirit)
// ==============================================================================

// Stage 1: Inkling Droplet
export function InklingDroplet() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 3) * 0.09;
      groupRef.current.rotation.y = t * 1.0;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Deep Indigo Glossy Ink Drop */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.22, 14, 12]} />
        <FlatMat color="#1E1B4B" roughness={0.2} metalness={0.4} />
      </mesh>
      {/* Upward Teardrop Spike */}
      <mesh position={[0, 0.38, 0]}>
        <coneGeometry args={[0.14, 0.26, 12]} />
        <FlatMat color="#1E1B4B" roughness={0.2} metalness={0.4} />
      </mesh>
      {/* Golden Quill Nib Tip on Tail */}
      <mesh position={[0, 0.52, 0]}>
        <coneGeometry args={[0.05, 0.12, 6]} />
        <FlatMat color="#FDE047" metalness={0.8} roughness={0.2} emissive="#EAB308" emissiveIntensity={1.5} />
      </mesh>
      {/* Starlight Fleck Eyes */}
      <mesh position={[-0.07, 0.24, 0.19]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <FlatMat color="#FDE047" emissive="#FACC15" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.07, 0.24, 0.19]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <FlatMat color="#FDE047" emissive="#FACC15" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

// Stage 2: Inkling Quillwing
export function InklingQuillwing() {
  const groupRef = useRef();
  const wingL = useRef();
  const wingR = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2.8) * 0.1;
      groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.3;
    }
    if (wingL.current) wingL.current.rotation.z = -0.2 + Math.sin(t * 4.5) * 0.3;
    if (wingR.current) wingR.current.rotation.z = 0.2 - Math.sin(t * 4.5) * 0.3;
  });

  return (
    <group ref={groupRef}>
      {/* Origami / Calligraphic Ink Bird Torso */}
      <mesh position={[0, 0.34, 0]}>
        <boxGeometry args={[0.24, 0.32, 0.38]} />
        <FlatMat color="#1E1B4B" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Sharp Feather Wings with Starlight Trim */}
      <group ref={wingL} position={[-0.18, 0.4, 0]}>
        <mesh rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.42, 0.04, 0.26]} />
          <FlatMat color="#312E81" roughness={0.4} />
        </mesh>
        <mesh position={[-0.22, 0, 0]}>
          <boxGeometry args={[0.08, 0.05, 0.24]} />
          <FlatMat color="#FDE047" emissive="#FACC15" emissiveIntensity={2} />
        </mesh>
      </group>
      <group ref={wingR} position={[0.18, 0.4, 0]}>
        <mesh rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.42, 0.04, 0.26]} />
          <FlatMat color="#312E81" roughness={0.4} />
        </mesh>
        <mesh position={[0.22, 0, 0]}>
          <boxGeometry args={[0.08, 0.05, 0.24]} />
          <FlatMat color="#FDE047" emissive="#FACC15" emissiveIntensity={2} />
        </mesh>
      </group>
      {/* Bird Head with Golden Beak */}
      <group position={[0, 0.54, 0.18]}>
        <mesh>
          <sphereGeometry args={[0.12, 10, 8]} />
          <FlatMat color="#1E1B4B" />
        </mesh>
        <mesh position={[0, -0.02, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.04, 0.14, 4]} />
          <FlatMat color="#FDE047" metalness={0.7} emissive="#FACC15" emissiveIntensity={2} />
        </mesh>
      </group>
      {/* Trailing Calligraphic Ribbon Tail */}
      <mesh position={[0, 0.18, -0.28]} rotation={[-0.6, 0, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.42]} />
        <FlatMat color="#4338CA" />
      </mesh>
    </group>
  );
}

// Stage 3: Inkling Leviathan
export function InklingLeviathan() {
  const groupRef = useRef();
  const orbitRingRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2) * 0.12;
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.4;
    }
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.x = t * 1.2;
      orbitRingRef.current.rotation.y = t * 1.6;
    }
  });

  return (
    <group ref={groupRef} scale={1.15}>
      {/* Cosmic Wyrm Body - Sinuous Indigo Segments */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.5, 10]} />
        <FlatMat color="#0F172A" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Glowing Nebula Inlay on Spine */}
      <mesh position={[0, 0.5, -0.1]}>
        <boxGeometry args={[0.06, 0.46, 0.04]} />
        <FlatMat color="#818CF8" emissive="#6366F1" emissiveIntensity={2.5} />
      </mesh>
      {/* Celestial Dragon Head */}
      <group position={[0, 0.82, 0.1]}>
        <mesh>
          <boxGeometry args={[0.26, 0.24, 0.34]} />
          <FlatMat color="#1E1B4B" roughness={0.2} metalness={0.5} />
        </mesh>
        {/* Golden Calligraphy Horns */}
        <mesh position={[-0.14, 0.16, -0.1]} rotation={[-0.4, 0, -0.4]}>
          <coneGeometry args={[0.045, 0.38, 6]} />
          <FlatMat color="#FDE047" metalness={0.8} emissive="#EAB308" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.14, 0.16, -0.1]} rotation={[-0.4, 0, 0.4]}>
          <coneGeometry args={[0.045, 0.38, 6]} />
          <FlatMat color="#FDE047" metalness={0.8} emissive="#EAB308" emissiveIntensity={2} />
        </mesh>
        {/* Blazing Starlight Eyes */}
        <mesh position={[-0.08, 0.04, 0.17]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <FlatMat color="#FFFFFF" emissive="#FDE047" emissiveIntensity={4} />
        </mesh>
        <mesh position={[0.08, 0.04, 0.17]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <FlatMat color="#FFFFFF" emissive="#FDE047" emissiveIntensity={4} />
        </mesh>
      </group>
      {/* Orbiting Starlight Constellation Rings */}
      <group ref={orbitRingRef} position={[0, 0.5, 0]}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.48, 0.02, 8, 24]} />
          <FlatMat color="#FDE047" metalness={0.8} emissive="#FACC15" emissiveIntensity={2.5} />
        </mesh>
      </group>
      {/* Undulating Cosmic Tail */}
      <mesh position={[0, 0.18, -0.2]} rotation={[0.7, 0, 0]}>
        <coneGeometry args={[0.16, 0.55, 8]} />
        <FlatMat color="#312E81" roughness={0.3} metalness={0.4} />
      </mesh>
      <pointLight color="#818CF8" intensity={2.8} distance={8} position={[0, 0.55, 0]} />
    </group>
  );
}

// ==============================================================================
// 5. MASTER SPIRIT COMPONENT
// ==============================================================================

const MODEL_MAP = {
  emberwisp_stage_1: EmberwispSpark,
  emberwisp_stage_2: EmberwispLantern,
  emberwisp_stage_3: EmberwispPyrespirit,
  rootling_stage_1: RootlingPebble,
  rootling_stage_2: RootlingRuneguard,
  rootling_stage_3: RootlingColossus,
  sproutling_stage_1: SproutlingSeed,
  sproutling_stage_2: SproutlingBloom,
  sproutling_stage_3: SproutlingDryad,
  inkling_stage_1: InklingDroplet,
  inkling_stage_2: InklingQuillwing,
  inkling_stage_3: InklingLeviathan
};

/**
 * RoamingSpiritCompanion
 * Implements autonomous gentle room-roaming flight paths across sanctuary waypoints,
 * with smooth acceleration, realistic turning/banking, inquisitive hovering pauses,
 * and an interactive joyful spin flip on click.
 */
function RoamingSpiritCompanion({ Component, roomName, onGreet = null }) {
  const groupRef = useRef();
  const stateRef = useRef({
    wpIndex: 0,
    pauseTimeLeft: 1.2,
    spinTimeLeft: 0,
    currentPos: null,
    targetPos: null
  });

  const isReadingNook = roomName.includes('Reading') || roomName.includes('Nook');
  const isGardenBalcony = roomName.includes('Garden') || roomName.includes('Balcony');

  // Custom organic flight waypoints per room adapted to 16x16 expanded room scale
  const waypoints = useMemo(() => {
    if (isReadingNook) {
      return [
        [-2.4, 2.4, 1.6],   // Hovering near velvet armchair and reading lamp
        [-4.8, 3.2, 0.4],   // Peeking out into starry twilight bay window
        [1.2, 2.2, 1.8],    // Gliding over emerald velvet rug
        [2.6, 3.4, -2.4],   // Inspecting the tall built-in library stacks
        [-0.8, 2.6, 2.2]    // Peaceful hovering turn near tea table
      ];
    }
    if (isGardenBalcony) {
      return [
        [-1.4, 2.4, 1.2],   // Breeze above marble bistro table
        [-3.6, 2.6, -3.2],  // Hovering over flowering terrace planter ledge
        [2.8, 2.5, 2.2],    // Sunlit corner overlook
        [1.6, 3.0, -2.0],   // Gliding past classical stone balustrade
        [-0.5, 2.6, 0.4]    // Warm center terrace hover
      ];
    }
    // Default: Study Desk
    return [
      [-2.8, 2.2, 0.8],   // Beside classical wooden study desk
      [-4.6, 3.2, -1.2],  // Near bright sunny double window
      [0.8, 2.2, 2.4],    // Gliding in a slow curve over the medallion rug
      [3.2, 2.8, -1.2],   // Near oak bookshelf & wall shelves
      [-0.6, 2.4, 0.4]    // Inquisitive peek above desk surface
    ];
  }, [isReadingNook, isGardenBalcony]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const s = stateRef.current;
    const t = clock.getElapsedTime();

    // 1. Initialize start position at first waypoint
    if (!s.currentPos) {
      s.currentPos = [...waypoints[0]];
      s.targetPos = [...waypoints[1 % waypoints.length]];
      groupRef.current.position.set(s.currentPos[0], s.currentPos[1], s.currentPos[2]);
    }

    // 2. Interactive Joyful Corkscrew Spin Flip & Greet Bounce
    if (s.spinTimeLeft > 0) {
      s.spinTimeLeft = Math.max(0, s.spinTimeLeft - delta);
      const progress = 1 - s.spinTimeLeft / 1.0;
      groupRef.current.rotation.y += delta * 15;
      groupRef.current.position.y = s.currentPos[1] + Math.sin(progress * Math.PI) * 0.55;
      const scaleBoost = 1 + Math.sin(progress * Math.PI) * 0.25;
      groupRef.current.scale.set(scaleBoost, scaleBoost, scaleBoost);
      return;
    } else if (groupRef.current.scale.x !== 1) {
      groupRef.current.scale.set(1, 1, 1);
    }

    // 3. Inquisitive Hovering Pause at Waypoint
    if (s.pauseTimeLeft > 0) {
      s.pauseTimeLeft -= delta;
      // Gentle breathing hover bob and tilt
      groupRef.current.position.y = s.currentPos[1] + Math.sin(t * 2.5) * 0.06;
      groupRef.current.rotation.y += Math.sin(t * 1.6) * 0.006;
      groupRef.current.rotation.z = Math.sin(t * 2.0) * 0.025;
      return;
    }

    // 4. Smooth Flight toward Target Waypoint
    const target = s.targetPos;
    const dx = target[0] - s.currentPos[0];
    const dy = target[1] - s.currentPos[1];
    const dz = target[2] - s.currentPos[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist < 0.12) {
      // Reached waypoint: switch to next destination with random pause duration
      s.currentPos = [...target];
      s.wpIndex = (s.wpIndex + 1) % waypoints.length;
      s.targetPos = [...waypoints[s.wpIndex]];
      s.pauseTimeLeft = 1.8 + Math.random() * 2.2; // 1.8s - 4.0s pause
    } else {
      const step = Math.min(dist, 0.52 * delta);
      const moveX = (dx / dist) * step;
      const moveY = (dy / dist) * step;
      const moveZ = (dz / dist) * step;

      s.currentPos[0] += moveX;
      s.currentPos[1] += moveY;
      s.currentPos[2] += moveZ;

      // Update position with continuous atmospheric hover wave
      groupRef.current.position.set(
        s.currentPos[0],
        s.currentPos[1] + Math.sin(t * 3.2) * 0.045,
        s.currentPos[2]
      );

      // Smooth heading orientation toward destination
      const targetAngle = Math.atan2(dx, dz);
      let diff = targetAngle - groupRef.current.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      groupRef.current.rotation.y += diff * Math.min(1, delta * 3.6);

      // Bank tilt into curve
      const bank = Math.max(-0.22, Math.min(0.22, -diff * 0.35));
      groupRef.current.rotation.z += (bank - groupRef.current.rotation.z) * delta * 4;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    stateRef.current.spinTimeLeft = 1.0;
    if (onGreet) onGreet();
  };

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => {
        if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
      }}
    >
      {/* Invisible Expanded Raycast Click Collider */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Component />
    </group>
  );
}

function PreviewSpiritCompanion({ Component, onGreet }) {
  const groupRef = useRef();
  const spinRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (spinRef.current > 0) {
      spinRef.current = Math.max(0, spinRef.current - delta);
      const progress = 1 - spinRef.current / 1.0;
      groupRef.current.rotation.y += delta * 15;
      groupRef.current.position.y = -0.3 + Math.sin(progress * Math.PI) * 0.45;
      const scaleBoost = 1 + Math.sin(progress * Math.PI) * 0.2;
      groupRef.current.scale.set(scaleBoost, scaleBoost, scaleBoost);
    } else if (groupRef.current.scale.x !== 1) {
      groupRef.current.scale.set(1, 1, 1);
      groupRef.current.position.y = -0.3;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    spinRef.current = 1.0;
    if (onGreet) onGreet();
  };

  return (
    <group
      ref={groupRef}
      position={[0, -0.3, 0]}
      onClick={handleClick}
      onPointerOver={() => {
        if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
      }}
    >
      {/* Invisible Raycast Click Collider */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Component />
    </group>
  );
}

/**
 * SpiritCompanion
 * Renders the active spirit model. When inside the sanctuary room, it wanders freely
 * across waypoints with organic flight kinematics. When in preview mode, it remains centered.
 */
export function SpiritCompanion({
  modelKey = 'emberwisp_stage_1',
  roomName = 'Study Desk',
  isPreview = false,
  onGreet = null
}) {
  const Component = MODEL_MAP[modelKey] || EmberwispSpark;

  // In dedicated inspection preview (SpiritPanel / Evolution Modal), center at [0, 0, 0]
  if (isPreview) {
    return <PreviewSpiritCompanion Component={Component} onGreet={onGreet} />;
  }

  // Autonomous free-roaming flight companion inside 3D Sanctuary rooms
  return <RoamingSpiritCompanion Component={Component} roomName={roomName} onGreet={onGreet} />;
}

export default SpiritCompanion;
