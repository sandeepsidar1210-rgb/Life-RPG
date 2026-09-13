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
// 1. EMBERWISP (Focus Spirit)
// ==============================================================================

// Stage 1: Emberwisp Spark
export function EmberwispSpark() {
  const groupRef = useRef();
  const spark1Ref = useRef();
  const spark2Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 3) * 0.08;
      groupRef.current.rotation.y = t * 0.8;
    }
    if (spark1Ref.current) {
      spark1Ref.current.position.x = Math.sin(t * 4) * 0.28;
      spark1Ref.current.position.z = Math.cos(t * 4) * 0.28;
      spark1Ref.current.position.y = 0.2 + Math.sin(t * 6) * 0.08;
    }
    if (spark2Ref.current) {
      spark2Ref.current.position.x = Math.sin(t * 3.5 + Math.PI) * 0.22;
      spark2Ref.current.position.z = Math.cos(t * 3.5 + Math.PI) * 0.22;
      spark2Ref.current.position.y = 0.1 + Math.cos(t * 5) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Flame Core */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.2, 12, 10]} />
        <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={1.8} />
      </mesh>
      {/* Inner White-Hot Nucleus */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.11, 10, 8]} />
        <FlatMat color="#FFFDE7" emissive="#FFF59D" emissiveIntensity={3} />
      </mesh>
      {/* Flame Tip Teardrop */}
      <mesh position={[0, 0.36, 0]}>
        <coneGeometry args={[0.13, 0.25, 8]} />
        <FlatMat color="#FB8C00" emissive="#F57C00" emissiveIntensity={1.5} />
      </mesh>
      {/* Friendly Glowing Eyes */}
      <mesh position={[-0.06, 0.22, 0.16]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <FlatMat color="#3E2723" />
      </mesh>
      <mesh position={[0.06, 0.22, 0.16]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <FlatMat color="#3E2723" />
      </mesh>
      {/* Orbiting Ember Sparks */}
      <mesh ref={spark1Ref}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <FlatMat color="#FFE082" emissive="#FFD54F" emissiveIntensity={2.5} />
      </mesh>
      <mesh ref={spark2Ref}>
        <boxGeometry args={[0.04, 0.04, 0.04]} />
        <FlatMat color="#FFB74D" emissive="#FFA726" emissiveIntensity={2} />
      </mesh>
      <pointLight color="#FF9800" intensity={1.2} distance={4} />
    </group>
  );
}

// Stage 2: Emberwisp Lantern
export function EmberwispLantern() {
  const groupRef = useRef();
  const wingLRef = useRef();
  const wingRRef = useRef();
  const flameRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.4;
    }
    if (wingLRef.current) wingLRef.current.rotation.z = -0.3 + Math.sin(t * 5) * 0.25;
    if (wingRRef.current) wingRRef.current.rotation.z = 0.3 - Math.sin(t * 5) * 0.25;
    if (flameRef.current) {
      const pulse = 1 + Math.sin(t * 4) * 0.1;
      flameRef.current.scale.set(pulse, pulse * 1.1, pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Brass Hexagonal Lantern Frame */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.48, 6, 1, true]} />
        <FlatMat color="#D4AF37" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Lantern Cap and Base */}
      <mesh position={[0, 0.58, 0]}>
        <coneGeometry args={[0.28, 0.18, 6]} />
        <FlatMat color="#B58F28" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.26, 0.28, 0.08, 6]} />
        <FlatMat color="#B58F28" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Lantern Ring Top */}
      <mesh position={[0, 0.72, 0]}>
        <torusGeometry args={[0.07, 0.02, 8, 16]} />
        <FlatMat color="#D4AF37" metalness={0.8} />
      </mesh>
      {/* Inner Glowing Spirit Core */}
      <group ref={flameRef} position={[0, 0.3, 0]}>
        <mesh>
          <sphereGeometry args={[0.14, 12, 10]} />
          <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={2.5} />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <coneGeometry args={[0.09, 0.18, 8]} />
          <FlatMat color="#FFF7C2" emissive="#FFEB3B" emissiveIntensity={3} />
        </mesh>
        {/* Bright Eyes inside Lantern */}
        <mesh position={[-0.05, 0.02, 0.12]}>
          <sphereGeometry args={[0.025, 8, 6]} />
          <FlatMat color="#3E2723" />
        </mesh>
        <mesh position={[0.05, 0.02, 0.12]}>
          <sphereGeometry args={[0.025, 8, 6]} />
          <FlatMat color="#3E2723" />
        </mesh>
      </group>
      {/* Flame Winglets */}
      <group ref={wingLRef} position={[-0.24, 0.35, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.09, 0.32, 6]} />
          <FlatMat color="#FF7043" emissive="#F4511E" emissiveIntensity={2} transparent opacity={0.85} />
        </mesh>
      </group>
      <group ref={wingRRef} position={[0.24, 0.35, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <coneGeometry args={[0.09, 0.32, 6]} />
          <FlatMat color="#FF7043" emissive="#F4511E" emissiveIntensity={2} transparent opacity={0.85} />
        </mesh>
      </group>
      <pointLight color="#FF9800" intensity={2.2} distance={6} position={[0, 0.3, 0]} />
    </group>
  );
}

// Stage 3: Emberwisp Pyrespirit
export function EmberwispPyrespirit() {
  const groupRef = useRef();
  const ringRef = useRef();
  const tailRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2) * 0.12;
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 1.5;
      ringRef.current.rotation.z = t * 2.0;
    }
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 3) * 0.4;
    }
  });

  return (
    <group ref={groupRef} scale={1.15}>
      {/* Dragonling Torso */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.2, 0.16, 0.48, 8]} />
        <FlatMat color="#E65100" emissive="#BF360C" emissiveIntensity={1.2} />
      </mesh>
      {/* Radiant Chest Plate */}
      <mesh position={[0, 0.48, 0.1]}>
        <boxGeometry args={[0.18, 0.28, 0.1]} />
        <FlatMat color="#FFD54F" emissive="#FFA000" emissiveIntensity={2.5} />
      </mesh>
      {/* Dragon Head */}
      <group position={[0, 0.78, 0.08]}>
        <mesh>
          <boxGeometry args={[0.24, 0.22, 0.32]} />
          <FlatMat color="#F57C00" emissive="#E65100" emissiveIntensity={1.4} />
        </mesh>
        {/* Golden Swept Antler Horns */}
        <mesh position={[-0.14, 0.16, -0.1]} rotation={[-0.4, 0, -0.5]}>
          <coneGeometry args={[0.045, 0.32, 6]} />
          <FlatMat color="#FFD700" metalness={0.7} roughness={0.3} emissive="#FFA000" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0.14, 0.16, -0.1]} rotation={[-0.4, 0, 0.5]}>
          <coneGeometry args={[0.045, 0.32, 6]} />
          <FlatMat color="#FFD700" metalness={0.7} roughness={0.3} emissive="#FFA000" emissiveIntensity={1.2} />
        </mesh>
        {/* Blazing Eyes */}
        <mesh position={[-0.08, 0.04, 0.16]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <FlatMat color="#FFFDE7" emissive="#FFFFFF" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.08, 0.04, 0.16]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <FlatMat color="#FFFDE7" emissive="#FFFFFF" emissiveIntensity={3} />
        </mesh>
      </group>
      {/* Orbiting Celestial Golden Rings */}
      <group ref={ringRef} position={[0, 0.5, 0]}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.42, 0.025, 8, 24]} />
          <FlatMat color="#FFD700" metalness={0.8} emissive="#FFA000" emissiveIntensity={2} />
        </mesh>
      </group>
      {/* Sinuous Flame Tail */}
      <group ref={tailRef} position={[0, 0.18, -0.15]}>
        <mesh rotation={[0.6, 0, 0]}>
          <coneGeometry args={[0.12, 0.5, 8]} />
          <FlatMat color="#FF7043" emissive="#D84315" emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[0, -0.22, -0.18]} rotation={[0.4, 0, 0]}>
          <coneGeometry args={[0.07, 0.35, 6]} />
          <FlatMat color="#FFA726" emissive="#FF9800" emissiveIntensity={2.5} />
        </mesh>
      </group>
      <pointLight color="#FF9800" intensity={3.2} distance={8} position={[0, 0.5, 0]} />
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
