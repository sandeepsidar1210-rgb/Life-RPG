import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Standard stylized material shorthand: flat-shaded low-poly aesthetic
const FlatMat = ({ color, roughness = 0.8, metalness = 0.1, emissive, emissiveIntensity = 1, transparent = false, opacity = 1 }) => (
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

/**
 * RoomBase
 * The low-poly room foundation: parquet floor, sage back wall, cream left wall,
 * sunny window with clouds, base wooden study desk, and woven floor rug.
 */
export function RoomBase() {
  return (
    <group>
      {/* --- Parquet Wooden Floor --- */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[7.6, 0.3, 7.6]} />
        <FlatMat color="#D8C4AA" roughness={0.7} />
      </mesh>

      {/* Subtle floor plank borders for voxel feel */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.4, 7.4]} />
        <meshBasicMaterial color="#C5B094" wireframe={true} transparent={true} opacity={0.25} />
      </mesh>

      {/* --- Back Wall (Soft Sage) --- */}
      <mesh position={[0, 2.5, -3.7]}>
        <boxGeometry args={[7.6, 5.0, 0.2]} />
        <FlatMat color="#BAC8B6" roughness={0.9} />
      </mesh>
      {/* Back Wall Baseboard Trim */}
      <mesh position={[0, 0.15, -3.55]}>
        <boxGeometry args={[7.6, 0.3, 0.1]} />
        <FlatMat color="#965842" />
      </mesh>

      {/* --- Left Wall (Warm Cream) --- */}
      <mesh position={[-3.7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5.0, 7.6]} />
        <FlatMat color="#EFE8DC" roughness={0.9} />
      </mesh>
      {/* Left Wall Baseboard Trim */}
      <mesh position={[-3.55, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.3, 7.6]} />
        <FlatMat color="#965842" />
      </mesh>

      {/* --- Sunny Window on Left Wall --- */}
      <group position={[-3.58, 2.8, -0.6]}>
        {/* Outer Wooden Frame */}
        <mesh position={[0.02, 0, 0]}>
          <boxGeometry args={[0.1, 2.4, 2.0]} />
          <FlatMat color="#7B5034" />
        </mesh>
        {/* Sky / Glass Panel */}
        <mesh position={[0.04, 0, 0]}>
          <boxGeometry args={[0.04, 2.1, 1.7]} />
          <FlatMat color="#9ED2E6" roughness={0.3} emissive="#79B9D2" emissiveIntensity={0.3} />
        </mesh>
        {/* Window Cross Mullions */}
        <mesh position={[0.06, 0, 0]}>
          <boxGeometry args={[0.03, 2.1, 0.08]} />
          <FlatMat color="#7B5034" />
        </mesh>
        <mesh position={[0.06, 0, 0]}>
          <boxGeometry args={[0.03, 0.08, 1.7]} />
          <FlatMat color="#7B5034" />
        </mesh>
        {/* Wooden Window Sill */}
        <mesh position={[0.12, -1.1, 0]}>
          <boxGeometry args={[0.26, 0.1, 2.2]} />
          <FlatMat color="#8F5E38" />
        </mesh>
        {/* Fluffy Low-Poly Clouds in Sky */}
        <group position={[0.05, 0.3, -0.2]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.03, 0.3, 0.6]} />
            <FlatMat color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, 0.12, 0.1]}>
            <boxGeometry args={[0.03, 0.25, 0.45]} />
            <FlatMat color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.2} />
          </mesh>
        </group>
      </group>

      {/* --- Floor Rug (Warm Terracotta Woven) --- */}
      <group position={[0.3, 0.015, 1.1]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.5, 32]} />
          <FlatMat color="#C87556" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.15, 32]} />
          <FlatMat color="#EDE1CE" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.85, 32]} />
          <FlatMat color="#D88A6E" roughness={0.9} />
        </mesh>
      </group>

      {/* --- Base Study Desk --- */}
      <group position={[0, 0, -0.4]}>
        {/* Table Top */}
        <mesh position={[0, 1.34, 0]}>
          <boxGeometry args={[3.2, 0.12, 1.6]} />
          <FlatMat color="#8F5E38" roughness={0.6} />
        </mesh>
        {/* Desk Edge Bevel */}
        <mesh position={[0, 1.39, 0]}>
          <boxGeometry args={[3.1, 0.02, 1.5]} />
          <FlatMat color="#9C6E48" roughness={0.6} />
        </mesh>
        {/* 4 Sturdy Legs */}
        <mesh position={[-1.45, 0.65, -0.65]}>
          <boxGeometry args={[0.14, 1.3, 0.14]} />
          <FlatMat color="#59381E" />
        </mesh>
        <mesh position={[1.45, 0.65, -0.65]}>
          <boxGeometry args={[0.14, 1.3, 0.14]} />
          <FlatMat color="#59381E" />
        </mesh>
        <mesh position={[-1.45, 0.65, 0.65]}>
          <boxGeometry args={[0.14, 1.3, 0.14]} />
          <FlatMat color="#59381E" />
        </mesh>
        <mesh position={[1.45, 0.65, 0.65]}>
          <boxGeometry args={[0.14, 1.3, 0.14]} />
          <FlatMat color="#59381E" />
        </mesh>
        {/* Side Drawer Unit */}
        <group position={[1.05, 0.85, 0]}>
          <mesh>
            <boxGeometry args={[0.7, 0.85, 1.3]} />
            <FlatMat color="#764929" />
          </mesh>
          {/* Drawer Knobs */}
          <mesh position={[-0.36, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
            <FlatMat color="#DFB659" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-0.36, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
            <FlatMat color="#DFB659" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
        {/* Scholar's Leather Journal on Desk */}
        <group position={[-0.2, 1.41, 0.2]} rotation={[0, 0.15, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.03, 0.65]} />
            <FlatMat color="#4E3320" />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.46, 0.02, 0.61]} />
            <FlatMat color="#F5EFE0" />
          </mesh>
          {/* Bookmark Ribbon */}
          <mesh position={[0, 0.03, 0.18]}>
            <boxGeometry args={[0.06, 0.01, 0.35]} />
            <FlatMat color="#C96B50" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * 1. Warm Desk Lamp
 * Brass base, curved stem, terracotta shade, warm emissive bulb + point light.
 */
export function DeskLampModel() {
  return (
    <group position={[-1.0, 1.4, -0.5]}>
      {/* Heavy Brass Base */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.06, 16]} />
        <FlatMat color="#D4AF37" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Lower Vertical Stem */}
      <mesh position={[0, 0.3, -0.04]} rotation={[-0.2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 10]} />
        <FlatMat color="#B58F28" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Joint Knuckle */}
      <mesh position={[0, 0.52, -0.09]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <FlatMat color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Upper Angled Stem */}
      <mesh position={[0, 0.65, 0.08]} rotation={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.4, 10]} />
        <FlatMat color="#B58F28" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Lamp Shade (Terracotta) */}
      <group position={[0, 0.74, 0.24]} rotation={[0.4, 0, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.08, 0.26, 16]} />
          <FlatMat color="#D16E50" roughness={0.5} />
        </mesh>
        {/* Emissive Warm Bulb */}
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <FlatMat color="#FFF7C2" emissive="#FFA000" emissiveIntensity={2.5} />
        </mesh>
        {/* Soft Warm Point Light */}
        <pointLight
          color="#FFA726"
          intensity={2.8}
          distance={6}
          decay={2}
          position={[0, -0.15, 0]}
        />
      </group>
    </group>
  );
}

/**
 * 2. Ceremonial Matcha Bowl
 * Earthy ceramic bowl, vibrant frothy matcha, bamboo whisk, and bobbing steam puffs.
 */
export function MatchaBowlModel() {
  const steamRef1 = useRef();
  const steamRef2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (steamRef1.current) {
      steamRef1.current.position.y = 0.25 + Math.sin(t * 3) * 0.06;
      steamRef1.current.scale.setScalar(0.8 + Math.sin(t * 3) * 0.2);
    }
    if (steamRef2.current) {
      steamRef2.current.position.y = 0.38 + Math.cos(t * 2.8) * 0.06;
      steamRef2.current.scale.setScalar(0.7 + Math.cos(t * 2.8) * 0.2);
    }
  });

  return (
    <group position={[-0.45, 1.4, -0.1]}>
      {/* Ceramic Chawan Bowl */}
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 0.18, 18]} />
        <FlatMat color="#3E543B" roughness={0.7} />
      </mesh>
      {/* Frothy Matcha Tea Surface */}
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 18]} />
        <FlatMat color="#83B34D" roughness={0.5} />
      </mesh>
      {/* Bamboo Chasen Whisk (leaning on the bowl edge) */}
      <group position={[0.2, 0.12, 0.08]} rotation={[0.4, 0.2, -0.5]}>
        <mesh>
          <cylinderGeometry args={[0.03, 0.06, 0.22, 10]} />
          <FlatMat color="#D6BD8A" roughness={0.6} />
        </mesh>
      </group>
      {/* Animated Steaming Puffs */}
      <mesh ref={steamRef1} position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <FlatMat color="#FFFFFF" transparent={true} opacity={0.4} emissive="#FFFFFF" emissiveIntensity={0.2} />
      </mesh>
      <mesh ref={steamRef2} position={[-0.03, 0.38, 0.02]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <FlatMat color="#FFFFFF" transparent={true} opacity={0.3} emissive="#FFFFFF" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

/**
 * 3. Lo-Fi Cassette Player
 * Retro dual-tone cassette boombox with animated spinning spools and buttons.
 */
export function LoFiCassettePlayerModel() {
  const spool1Ref = useRef();
  const spool2Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 4;
    if (spool1Ref.current) spool1Ref.current.rotation.z = t;
    if (spool2Ref.current) spool2Ref.current.rotation.z = t;
  });

  return (
    <group position={[0.45, 1.4, -0.45]}>
      {/* Main Vintage Casing */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.65, 0.32, 0.36]} />
        <FlatMat color="#C96B50" roughness={0.6} />
      </mesh>
      {/* Front Faceplate (Warm Cream) */}
      <mesh position={[0, 0.16, 0.182]}>
        <boxGeometry args={[0.6, 0.28, 0.01]} />
        <FlatMat color="#EFE6D5" roughness={0.7} />
      </mesh>
      {/* Clear Cassette Well */}
      <mesh position={[-0.08, 0.16, 0.19]}>
        <boxGeometry args={[0.34, 0.18, 0.015]} />
        <FlatMat color="#2B2B2B" roughness={0.4} />
      </mesh>
      {/* Rotating Cassette Spools */}
      <group position={[-0.15, 0.16, 0.2]} ref={spool1Ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.01, 8]} />
          <FlatMat color="#E8E8E8" />
        </mesh>
      </group>
      <group position={[-0.01, 0.16, 0.2]} ref={spool2Ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.01, 8]} />
          <FlatMat color="#E8E8E8" />
        </mesh>
      </group>
      {/* Dial Knobs */}
      <mesh position={[0.18, 0.2, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
        <FlatMat color="#424242" metalness={0.5} />
      </mesh>
      <mesh position={[0.18, 0.1, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
        <FlatMat color="#424242" metalness={0.5} />
      </mesh>
      {/* Top Play/Pause Keys */}
      <mesh position={[-0.08, 0.33, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.08]} />
        <FlatMat color="#424242" />
      </mesh>
      {/* Metal Antenna */}
      <mesh position={[0.26, 0.42, -0.1]} rotation={[0.2, 0, -0.3]}>
        <cylinderGeometry args={[0.008, 0.008, 0.35, 8]} />
        <FlatMat color="#D1D5DB" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * 4. Potted Succulent
 * Terracotta pot, dark soil, clustered geometric jade leaves. Positioned cleanly on the study desk.
 */
export function PottedSucculentModel() {
  return (
    <group position={[1.05, 1.4, 0.15]}>
      {/* Terracotta Planter */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.14, 0.1, 0.24, 14]} />
        <FlatMat color="#B85C38" roughness={0.8} />
      </mesh>
      {/* Pot Rim */}
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.04, 14]} />
        <FlatMat color="#A64E2D" roughness={0.8} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.13, 14]} />
        <FlatMat color="#3D291C" roughness={0.9} />
      </mesh>
      {/* Geometric Succulent Rosette Leaves */}
      <group position={[0, 0.28, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={i}
            rotation={[0.5, (i * Math.PI) / 3, 0]}
            position={[Math.sin((i * Math.PI) / 3) * 0.07, 0, Math.cos((i * Math.PI) / 3) * 0.07]}
          >
            <boxGeometry args={[0.07, 0.04, 0.13]} />
            <FlatMat color="#6B9670" roughness={0.7} />
          </mesh>
        ))}
        {/* Inner Succulent Core */}
        <mesh position={[0, 0.04, 0]}>
          <coneGeometry args={[0.07, 0.1, 8]} />
          <FlatMat color="#88B88D" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 5. Zen Bonsai Tree
 * Wooden display pedestal, ceramic tray, gnarled winding trunk, and vibrant moss canopies.
 */
export function ZenBonsaiTreeModel() {
  return (
    <group position={[-2.4, 0, 1.2]}>
      {/* Wood Display Pedestal */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.85, 0.6, 0.85]} />
        <FlatMat color="#4E311B" roughness={0.8} />
      </mesh>
      {/* Pedestal Top Edge */}
      <mesh position={[0, 0.61, 0]}>
        <boxGeometry args={[0.92, 0.04, 0.92]} />
        <FlatMat color="#633F23" roughness={0.8} />
      </mesh>
      {/* Bonsai Ceramic Shallow Tray */}
      <mesh position={[0, 0.67, 0]}>
        <cylinderGeometry args={[0.34, 0.28, 0.08, 16]} />
        <FlatMat color="#3B444B" roughness={0.5} />
      </mesh>
      {/* Dark Soil */}
      <mesh position={[0, 0.71, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 16]} />
        <FlatMat color="#2B1D14" roughness={0.9} />
      </mesh>
      {/* Gnarled Bonsai Trunk */}
      <group position={[0, 0.7, 0]}>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.06, 0.09, 0.4, 8]} />
          <FlatMat color="#5C3A21" roughness={0.9} />
        </mesh>
        <mesh position={[-0.08, 0.45, 0.02]} rotation={[0.3, 0, 0.4]}>
          <cylinderGeometry args={[0.045, 0.06, 0.35, 8]} />
          <FlatMat color="#5C3A21" roughness={0.9} />
        </mesh>
        <mesh position={[0.08, 0.55, -0.05]} rotation={[-0.4, 0.2, -0.5]}>
          <cylinderGeometry args={[0.035, 0.05, 0.3, 8]} />
          <FlatMat color="#5C3A21" roughness={0.9} />
        </mesh>
        {/* Layered Foliage Clouds */}
        <mesh position={[-0.18, 0.65, 0.08]}>
          <sphereGeometry args={[0.2, 10, 10]} />
          <FlatMat color="#3D683A" roughness={0.8} />
        </mesh>
        <mesh position={[0.16, 0.72, -0.08]}>
          <sphereGeometry args={[0.22, 10, 10]} />
          <FlatMat color="#4F7E4B" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.88, 0]}>
          <sphereGeometry args={[0.25, 12, 12]} />
          <FlatMat color="#386134" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 6. Oak Bookshelf
 * Tall solid oak shelving unit against the back wall, packed with colorful books and scholar crystal.
 */
export function OakBookshelfModel() {
  return (
    <group position={[2.5, 0, -3.3]}>
      {/* Wooden Case Frame */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[1.6, 3.6, 0.55]} />
        <FlatMat color="#764929" roughness={0.7} />
      </mesh>
      {/* Hollow Interior Pocket */}
      <mesh position={[0, 1.8, 0.05]}>
        <boxGeometry args={[1.44, 3.44, 0.5]} />
        <FlatMat color="#59371E" roughness={0.8} />
      </mesh>
      {/* 3 Shelves */}
      <mesh position={[0, 1.0, 0.05]}>
        <boxGeometry args={[1.44, 0.06, 0.48]} />
        <FlatMat color="#764929" />
      </mesh>
      <mesh position={[0, 1.9, 0.05]}>
        <boxGeometry args={[1.44, 0.06, 0.48]} />
        <FlatMat color="#764929" />
      </mesh>
      <mesh position={[0, 2.8, 0.05]}>
        <boxGeometry args={[1.44, 0.06, 0.48]} />
        <FlatMat color="#764929" />
      </mesh>

      {/* Row 1 Books (Bottom Shelf) */}
      <group position={[-0.5, 0.5, 0.1]}>
        {[
          { color: '#C86749', w: 0.12, h: 0.65 },
          { color: '#DDA843', w: 0.09, h: 0.58 },
          { color: '#769871', w: 0.14, h: 0.7 },
          { color: '#FAF6EE', w: 0.1, h: 0.62 },
          { color: '#4B6B78', w: 0.13, h: 0.66 },
          { color: '#9C583B', w: 0.11, h: 0.59 }
        ].map((b, idx) => (
          <mesh key={idx} position={[idx * 0.16, 0, 0]}>
            <boxGeometry args={[b.w, b.h, 0.32]} />
            <FlatMat color={b.color} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Row 2 Books (Middle Shelf) */}
      <group position={[-0.55, 1.45, 0.1]}>
        {[
          { color: '#769871', w: 0.11, h: 0.62 },
          { color: '#FAF6EE', w: 0.13, h: 0.55 },
          { color: '#C86749', w: 0.1, h: 0.68 },
          { color: '#DDA843', w: 0.14, h: 0.6 }
        ].map((b, idx) => (
          <mesh key={idx} position={[idx * 0.16, 0, 0]}>
            <boxGeometry args={[b.w, b.h, 0.32]} />
            <FlatMat color={b.color} roughness={0.6} />
          </mesh>
        ))}
        {/* Leaning Book */}
        <mesh position={[0.75, 0.02, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.12, 0.66, 0.32]} />
          <FlatMat color="#8B4D3B" roughness={0.6} />
        </mesh>
      </group>

      {/* Top Shelf: Quartz Scholar Focus Crystal */}
      <group position={[0, 3.05, 0.1]}>
        <mesh rotation={[0, 0.4, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <FlatMat color="#BEE7F2" emissive="#75C6DE" emissiveIntensity={0.6} transparent={true} opacity={0.85} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 7. Sleepy Calico Cat (Companion)
 * Curled up comfortably on the floor rug, with rhythmic breathing idle animation via useFrame.
 */
export function SleepyCalicoCatModel() {
  const catRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (catRef.current) {
      // Gentle breathing scale on Y and Z
      const breath = Math.sin(t * 2.2) * 0.05;
      catRef.current.scale.set(1 + breath * 0.5, 1 + breath, 1 + breath * 0.5);
    }
  });

  return (
    <group position={[0.35, 0.05, 1.1]}>
      <group ref={catRef}>
        {/* Curled Body (Calico Cream Base) */}
        <mesh position={[0, 0.14, 0]} rotation={[0, 0.3, 0]}>
          <sphereGeometry args={[0.3, 14, 12]} />
          <FlatMat color="#FAF5EE" roughness={0.8} />
        </mesh>
        {/* Calico Orange Patch */}
        <mesh position={[0.08, 0.22, 0.06]} rotation={[0.2, 0.4, 0]}>
          <sphereGeometry args={[0.17, 10, 10]} />
          <FlatMat color="#E27E38" roughness={0.8} />
        </mesh>
        {/* Calico Dark Charcoal Patch */}
        <mesh position={[-0.1, 0.21, -0.07]} rotation={[-0.2, 0, 0.3]}>
          <sphereGeometry args={[0.15, 10, 10]} />
          <FlatMat color="#3D3430" roughness={0.8} />
        </mesh>
        {/* Sleeping Tucked Head */}
        <mesh position={[0.24, 0.16, 0.12]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <FlatMat color="#FAF5EE" roughness={0.8} />
        </mesh>
        {/* Cat Ears */}
        <mesh position={[0.28, 0.3, 0.06]} rotation={[0.3, 0, 0.4]}>
          <coneGeometry args={[0.05, 0.09, 4]} />
          <FlatMat color="#E27E38" />
        </mesh>
        <mesh position={[0.32, 0.28, 0.2]} rotation={[0.2, 0, -0.2]}>
          <coneGeometry args={[0.05, 0.09, 4]} />
          <FlatMat color="#3D3430" />
        </mesh>
        {/* Curled Sleeping Tail */}
        <mesh position={[-0.22, 0.06, 0.12]} rotation={[0, 0.8, -Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.025, 0.35, 8]} />
          <FlatMat color="#E27E38" />
        </mesh>
      </group>

      {/* Floating Soft Zzz sleep symbol */}
      <group position={[0.35, 0.45, 0.15]}>
        <mesh>
          <boxGeometry args={[0.06, 0.015, 0.015]} />
          <FlatMat color="#9EA5AE" emissive="#9EA5AE" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 8. Wise Study Owl (Companion)
 * Perched on a rustic wooden stand, with gentle idle breathing and inquisitive head rotations.
 */
export function WiseStudyOwlModel() {
  const headRef = useRef();
  const bodyRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Gentle breathing
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(t * 2.0) * 0.03;
    }
    // Inquisitive head turning
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.3) * 0.35;
    }
  });

  return (
    <group position={[-2.4, 0, -2.2]}>
      {/* Rustic Wooden Perch Stand */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 2.0, 8]} />
        <FlatMat color="#5C3B24" roughness={0.9} />
      </mesh>
      {/* Tripod Base */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.08, 12]} />
        <FlatMat color="#4A2E1A" roughness={0.9} />
      </mesh>
      {/* Horizontal Branch Crossbar */}
      <mesh position={[0, 2.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <FlatMat color="#5C3B24" roughness={0.9} />
      </mesh>

      {/* The Owl */}
      <group position={[0, 2.05, 0]}>
        {/* Talons gripping perch */}
        <mesh position={[-0.07, 0.02, 0.03]}>
          <boxGeometry args={[0.04, 0.04, 0.08]} />
          <FlatMat color="#DDA032" />
        </mesh>
        <mesh position={[0.07, 0.02, 0.03]}>
          <boxGeometry args={[0.04, 0.04, 0.08]} />
          <FlatMat color="#DDA032" />
        </mesh>

        {/* Feathered Body */}
        <group ref={bodyRef} position={[0, 0.26, 0]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.22, 0.44, 12]} />
            <FlatMat color="#5E4432" roughness={0.8} />
          </mesh>
          {/* Speckled Cream Belly */}
          <mesh position={[0, -0.02, 0.1]}>
            <sphereGeometry args={[0.16, 10, 10]} />
            <FlatMat color="#EDE4D6" roughness={0.8} />
          </mesh>
          {/* Folded Wings */}
          <mesh position={[-0.18, 0, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.06, 0.38, 0.22]} />
            <FlatMat color="#483324" roughness={0.8} />
          </mesh>
          <mesh position={[0.18, 0, 0]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.06, 0.38, 0.22]} />
            <FlatMat color="#483324" roughness={0.8} />
          </mesh>
        </group>

        {/* Owl Head with Inquisitive Turn */}
        <group ref={headRef} position={[0, 0.56, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 12, 12]} />
            <FlatMat color="#5E4432" roughness={0.8} />
          </mesh>
          {/* Feather Horn Tufts */}
          <mesh position={[-0.1, 0.19, -0.02]} rotation={[0, 0, -0.3]}>
            <coneGeometry args={[0.04, 0.12, 4]} />
            <FlatMat color="#483324" />
          </mesh>
          <mesh position={[0.1, 0.19, -0.02]} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.04, 0.12, 4]} />
            <FlatMat color="#483324" />
          </mesh>
          {/* Big Amber Owl Eyes */}
          <group position={[-0.07, 0.04, 0.16]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.06, 12]} />
              <FlatMat color="#F5AF34" roughness={0.3} emissive="#F5AF34" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.03, 10]} />
              <FlatMat color="#1E1E1E" />
            </mesh>
          </group>
          <group position={[0.07, 0.04, 0.16]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.06, 12]} />
              <FlatMat color="#F5AF34" roughness={0.3} emissive="#F5AF34" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.03, 10]} />
              <FlatMat color="#1E1E1E" />
            </mesh>
          </group>
          {/* Sharp Golden Beak */}
          <mesh position={[0, -0.04, 0.2]} rotation={[0.4, 0, 0]}>
            <coneGeometry args={[0.035, 0.08, 4]} />
            <FlatMat color="#DDA032" roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
