import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * CozyMat
 * Soft toon / stylized material with warm highlights, smooth shading,
 * and standard PBR response for cozy depth and soft shadows.
 */
export const CozyMat = ({
  color,
  roughness = 0.65,
  metalness = 0.08,
  emissive = undefined,
  emissiveIntensity = 1,
  transparent = false,
  opacity = 1
}) => (
  <meshStandardMaterial
    color={color}
    roughness={roughness}
    metalness={metalness}
    flatShading={false}
    emissive={emissive}
    emissiveIntensity={emissiveIntensity}
    transparent={transparent}
    opacity={opacity}
  />
);

// Shorthand for flat-shaded low-poly accents where crisp facets are desired
export const FacetMat = ({
  color,
  roughness = 0.7,
  metalness = 0.05,
  emissive = undefined,
  emissiveIntensity = 1,
  transparent = false,
  opacity = 1
}) => (
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
 * FloatingDustMotes
 * Ambient detail: tiny golden particles drifting through room light beams
 */
export function FloatingDustMotes({ count = 28, range = [10, 6, 10], color = '#FFF0BA' }) {
  const meshRef = useRef();

  const motes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * range[0],
      baseY: 0.8 + Math.random() * (range[1] - 0.8),
      z: (Math.random() - 0.5) * range[2],
      speed: 0.3 + Math.random() * 0.4,
      offset: i * 1.3,
      size: 0.04 + Math.random() * 0.04
    }));
  }, [count, range]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const children = meshRef.current.children;
    const len = Math.min(children.length, motes.length);
    for (let i = 0; i < len; i++) {
      const m = motes[i];
      const child = children[i];
      if (m && child) {
        child.position.y = m.baseY + Math.sin(t * m.speed + m.offset) * 0.35;
        child.position.x = m.x + Math.sin(t * 0.2 + m.offset) * 0.25;
        child.position.z = m.z + Math.cos(t * 0.25 + m.offset) * 0.25;
      }
    }
  });

  return (
    <group ref={meshRef}>
      {motes.map((m, i) => (
        <mesh key={i} position={[m.x, m.baseY, m.z]}>
          <sphereGeometry args={[m.size, 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.65} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * RoomBase (Study Desk Sanctuary)
 * 2.1x scale expansion: 16x16 units floor, 7.5 units height.
 * Rich parquet floor with dark wood perimeter border, warm sage plaster back wall,
 * cream left wall with crown/chair rail mouldings, large sunlit double-hung window,
 * generous executive study desk with stationery, and warm terracotta medallion rug.
 */
export function RoomBase() {
  return (
    <group>
      {/* --- Parquet Wooden Floor (16x16) --- */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[16.0, 0.4, 16.0]} />
        <CozyMat color="#D8C4AA" roughness={0.6} />
      </mesh>

      {/* Decorative floor border inlays */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15.6, 15.6]} />
        <meshBasicMaterial color="#BFA586" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Outer dark walnut floor perimeter frame */}
      <mesh position={[0, 0.01, -7.6]}>
        <boxGeometry args={[16.0, 0.02, 0.5]} />
        <CozyMat color="#654321" roughness={0.5} />
      </mesh>
      <mesh position={[-7.6, 0.01, 0]}>
        <boxGeometry args={[0.5, 0.02, 16.0]} />
        <CozyMat color="#654321" roughness={0.5} />
      </mesh>

      {/* --- Back Wall (Soft Sage Plaster, 16x7.5) --- */}
      <mesh position={[0, 3.6, -7.8]} receiveShadow>
        <boxGeometry args={[16.0, 7.6, 0.4]} />
        <CozyMat color="#BAC8B6" roughness={0.88} />
      </mesh>
      {/* Baseboard Moulding */}
      <mesh position={[0, 0.25, -7.55]} castShadow receiveShadow>
        <boxGeometry args={[16.0, 0.5, 0.16]} />
        <CozyMat color="#76432A" />
      </mesh>
      {/* Chair Rail Moulding */}
      <mesh position={[0, 2.6, -7.57]}>
        <boxGeometry args={[16.0, 0.12, 0.1]} />
        <CozyMat color="#8F5E38" />
      </mesh>
      {/* Crown Moulding */}
      <mesh position={[0, 7.2, -7.55]} castShadow>
        <boxGeometry args={[16.0, 0.35, 0.2]} />
        <CozyMat color="#6B3E26" />
      </mesh>

      {/* --- Left Wall (Warm Cream Plaster, 16x7.5) --- */}
      <mesh position={[-7.8, 3.6, 0]} receiveShadow>
        <boxGeometry args={[0.4, 7.6, 16.0]} />
        <CozyMat color="#EFE8DC" roughness={0.9} />
      </mesh>
      {/* Baseboard Moulding */}
      <mesh position={[-7.55, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.16, 0.5, 16.0]} />
        <CozyMat color="#76432A" />
      </mesh>
      {/* Chair Rail Moulding */}
      <mesh position={[-7.57, 2.6, 0]}>
        <boxGeometry args={[0.1, 0.12, 16.0]} />
        <CozyMat color="#8F5E38" />
      </mesh>
      {/* Crown Moulding */}
      <mesh position={[-7.55, 7.2, 0]} castShadow>
        <boxGeometry args={[0.2, 0.35, 16.0]} />
        <CozyMat color="#6B3E26" />
      </mesh>

      {/* --- Grand Sunny Double Window on Left Wall --- */}
      <group position={[-7.55, 4.2, -1.2]}>
        {/* Outer Heavy Timber Frame */}
        <mesh position={[0.04, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.18, 4.4, 3.6]} />
          <CozyMat color="#59381E" />
        </mesh>
        {/* Glass Sky Pane with Emissive Glow */}
        <mesh position={[0.08, 0, 0]}>
          <boxGeometry args={[0.06, 4.0, 3.2]} />
          <CozyMat color="#A0D8EF" emissive="#7CC0DC" emissiveIntensity={0.5} roughness={0.2} />
        </mesh>
        {/* Vertical & Horizontal Window Mullions */}
        <mesh position={[0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 4.0, 0.12]} />
          <CozyMat color="#6B4324" />
        </mesh>
        <mesh position={[0.12, 0.4, 0]} castShadow>
          <boxGeometry args={[0.05, 0.12, 3.2]} />
          <CozyMat color="#6B4324" />
        </mesh>
        {/* Deep Wooden Window Sill (Placement Anchor Zone) */}
        <mesh position={[0.32, -2.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.65, 0.22, 4.0]} />
          <CozyMat color="#7C4B27" />
        </mesh>
        {/* Window Sill Support Corbels */}
        <mesh position={[0.2, -2.25, -1.4]} castShadow>
          <boxGeometry args={[0.3, 0.35, 0.18]} />
          <CozyMat color="#59381E" />
        </mesh>
        <mesh position={[0.2, -2.25, 1.4]} castShadow>
          <boxGeometry args={[0.3, 0.35, 0.18]} />
          <CozyMat color="#59381E" />
        </mesh>
        {/* Fluffy Pixel Clouds Drifting in Window */}
        <group position={[0.1, 0.6, -0.4]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 0.5, 1.1]} />
            <CozyMat color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 0.22, 0.2]}>
            <boxGeometry args={[0.04, 0.4, 0.8]} />
            <CozyMat color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
          </mesh>
        </group>
      </group>

      {/* --- Ambient Floating Sunbeam Dust Motes --- */}
      <FloatingDustMotes count={32} range={[12, 6.5, 12]} color="#FFF3C4" />

      {/* --- Large Woven Terracotta Medallion Rug --- */}
      <group position={[0.2, 0.015, 1.4]} receiveShadow>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[2.8, 32]} />
          <CozyMat color="#C87556" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.2, 32]} />
          <CozyMat color="#F2E8D8" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.5, 32]} />
          <CozyMat color="#D88A6E" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.7, 32]} />
          <CozyMat color="#78350F" roughness={0.9} />
        </mesh>
      </group>

      {/* --- Base Large Executive Study Desk --- */}
      <group position={[0, 0, -0.6]}>
        {/* Main Desktop (Wide & spacious: 4.8 x 2.2) */}
        <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.16, 2.2]} />
          <CozyMat color="#8F5E38" roughness={0.5} />
        </mesh>
        {/* Inlaid Leather Writing Pad */}
        <mesh position={[-0.2, 1.44, 0.1]} receiveShadow>
          <boxGeometry args={[2.6, 0.02, 1.4]} />
          <CozyMat color="#3D2614" roughness={0.8} />
        </mesh>
        {/* Gold Border Trim on Desk Edge */}
        <mesh position={[0, 1.35, 1.11]}>
          <boxGeometry args={[4.8, 0.04, 0.04]} />
          <CozyMat color="#DFB659" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* 4 Sturdy Classical Legs */}
        {[
          [-2.2, 0.65, -0.95],
          [2.2, 0.65, -0.95],
          [-2.2, 0.65, 0.95],
          [2.2, 0.65, 0.95],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 1.3, 0.22]} />
            <CozyMat color="#59381E" />
          </mesh>
        ))}
        {/* Dual Pedestal Drawers (Right side) */}
        <group position={[1.7, 0.8, 0]} castShadow receiveShadow>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.95, 1.9]} />
            <CozyMat color="#764929" />
          </mesh>
          {/* Drawer Knobs */}
          {[-0.25, 0.25].map((dy, i) => (
            <mesh key={i} position={[-0.52, dy, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
              <CozyMat color="#DFB659" metalness={0.7} roughness={0.25} />
            </mesh>
          ))}
        </group>
        {/* Scholar's Stationery & Journal on Desk */}
        <group position={[-0.3, 1.46, 0.2]} rotation={[0, 0.12, 0]} castShadow>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.04, 0.85]} />
            <CozyMat color="#4E3320" />
          </mesh>
          <mesh position={[0, 0.025, 0]}>
            <boxGeometry args={[0.6, 0.02, 0.8]} />
            <CozyMat color="#F5EFE0" />
          </mesh>
          {/* Crimson Ribbon Bookmark */}
          <mesh position={[0, 0.038, 0.25]}>
            <boxGeometry args={[0.08, 0.01, 0.45]} />
            <CozyMat color="#B91C1C" />
          </mesh>
          {/* Brass Dip Pen */}
          <mesh position={[0.42, 0.02, -0.1]} rotation={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.55, 8]} />
            <CozyMat color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * ReadingNookBase (Level 5 Chamber)
 * Rich Oxford library atmosphere: dark walnut herringbone floor, deep forest green walls,
 * full-height grand mahogany built-in bookshelves along the entire back wall with gold mouldings,
 * romantic twilight arched window looking onto glowing moon and stars, velvet reading armchair,
 * and circular tea pedestal table.
 */
export function ReadingNookBase() {
  return (
    <group>
      {/* --- Dark Walnut Herringbone Floor (16x16) --- */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[16.0, 0.4, 16.0]} />
        <CozyMat color="#3D2617" roughness={0.55} />
      </mesh>
      {/* Subtle floor plank seams */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15.6, 15.6]} />
        <meshBasicMaterial color="#27160A" wireframe transparent opacity={0.3} />
      </mesh>

      {/* --- Back Wall (Deep Forest Library Green, 16x7.5) --- */}
      <mesh position={[0, 3.6, -7.8]} receiveShadow>
        <boxGeometry args={[16.0, 7.6, 0.4]} />
        <CozyMat color="#1E382B" roughness={0.9} />
      </mesh>
      {/* Gilded Picture Rail */}
      <mesh position={[0, 6.8, -7.56]} castShadow>
        <boxGeometry args={[16.0, 0.16, 0.1]} />
        <CozyMat color="#D4AF37" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Baseboard Trim */}
      <mesh position={[0, 0.25, -7.55]} castShadow receiveShadow>
        <boxGeometry args={[16.0, 0.5, 0.16]} />
        <CozyMat color="#2B180D" />
      </mesh>

      {/* --- Left Wall (Oxford Slate Navy, 16x7.5) --- */}
      <mesh position={[-7.8, 3.6, 0]} receiveShadow>
        <boxGeometry args={[0.4, 7.6, 16.0]} />
        <CozyMat color="#1B263B" roughness={0.9} />
      </mesh>
      <mesh position={[-7.55, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.16, 0.5, 16.0]} />
        <CozyMat color="#2B180D" />
      </mesh>

      {/* --- Grand Built-in Mahogany Bookshelves along Back Wall --- */}
      <group position={[-1.2, 3.5, -7.3]} castShadow receiveShadow>
        {/* Main Cabinet Frame */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[9.4, 6.6, 0.7]} />
          <CozyMat color="#422513" />
        </mesh>
        {/* Recessed Cavity */}
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[9.0, 6.2, 0.55]} />
          <CozyMat color="#261409" />
        </mesh>
        {/* 5 Shelf Levels */}
        {[-2.2, -1.1, 0, 1.1, 2.2].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0.15]} castShadow receiveShadow>
            <boxGeometry args={[9.0, 0.14, 0.6]} />
            <CozyMat color="#502E19" />
          </mesh>
        ))}
        {/* Gilded Arch Header */}
        <mesh position={[0, 3.2, 0.25]} castShadow>
          <boxGeometry args={[9.4, 0.35, 0.25]} />
          <CozyMat color="#D4AF37" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Decorative Rows of Scholarly Books across Shelves */}
        {[-1.6, -0.5, 0.6, 1.7].map((shelfY, rowIdx) => (
          <group key={rowIdx} position={[-4.0, shelfY, 0.25]}>
            {Array.from({ length: 18 }).map((_, bIdx) => {
              const colors = ['#8E2828', '#B8860B', '#274C77', '#2D6A4F', '#6B4226', '#1F2937', '#78290F'];
              const col = colors[(rowIdx * 3 + bIdx) % colors.length];
              const h = 0.55 + Math.sin(bIdx * 1.5) * 0.12;
              return (
                <mesh key={bIdx} position={[bIdx * 0.44, h / 2 - 0.25, 0]} castShadow>
                  <boxGeometry args={[0.26, h, 0.36]} />
                  <CozyMat color={col} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>

      {/* --- Arched Twilight Bay Window with Crescent Moon & Stars --- */}
      <group position={[-7.55, 4.4, 0.6]}>
        {/* Outer Arched Frame */}
        <mesh position={[0.04, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.18, 4.8, 3.8]} />
          <CozyMat color="#3D2111" />
        </mesh>
        {/* Twilight Dark Violet Sky */}
        <mesh position={[0.08, 0, 0]}>
          <boxGeometry args={[0.06, 4.4, 3.4]} />
          <CozyMat color="#2A1B4E" emissive="#3B2668" emissiveIntensity={0.6} roughness={0.2} />
        </mesh>
        {/* Window Bars */}
        <mesh position={[0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 4.4, 0.1]} />
          <CozyMat color="#3D2111" />
        </mesh>
        <mesh position={[0.12, 0.3, 0]} castShadow>
          <boxGeometry args={[0.05, 0.1, 3.4]} />
          <CozyMat color="#3D2111" />
        </mesh>
        {/* Glowing Crescent Moon */}
        <group position={[0.1, 1.1, -0.5]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.32, 0.09, 10, 32, Math.PI * 1.3]} />
            <CozyMat color="#FFFBEB" emissive="#FFF4C4" emissiveIntensity={1.2} />
          </mesh>
        </group>
        {/* Sparkling Distant Stars */}
        {[
          [0.1, 1.2, 0.6],
          [0.1, 0.6, -0.8],
          [0.1, -0.4, 0.8],
          [0.1, -0.9, -0.3],
          [0.1, 0.2, 1.1]
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <octahedronGeometry args={[0.06]} />
            <CozyMat color="#FFE8A3" emissive="#FFE8A3" emissiveIntensity={1.5} />
          </mesh>
        ))}
        {/* Deep Bay Window Sill (Placement Anchor Zone) */}
        <mesh position={[0.32, -2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.24, 4.2]} />
          <CozyMat color="#502E19" />
        </mesh>
      </group>

      {/* Ambient Floating Dust Motes */}
      <FloatingDustMotes count={32} range={[12, 6.5, 12]} color="#E9D5FF" />

      {/* --- Victorian Emerald & Gold Rug --- */}
      <group position={[0.4, 0.015, 1.4]} receiveShadow>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[4.8, 3.8]} />
          <CozyMat color="#194D33" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.4, 3.4]} />
          <CozyMat color="#D4AF37" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.0, 3.0]} />
          <CozyMat color="#133C27" roughness={0.88} />
        </mesh>
      </group>

      {/* --- Plush Velvet Reading Armchair --- */}
      <group position={[-1.2, 0, 1.2]} rotation={[0, 0.45, 0]}>
        {/* Seat Base */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.42, 1.5]} />
          <CozyMat color="#8B2635" roughness={0.8} />
        </mesh>
        {/* Plush Cushion */}
        <mesh position={[0, 0.9, 0.06]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.24, 1.3]} />
          <CozyMat color="#9E2A3B" roughness={0.85} />
        </mesh>
        {/* High Tufted Backrest */}
        <mesh position={[0, 1.6, -0.6]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 1.4, 0.35]} />
          <CozyMat color="#8B2635" roughness={0.8} />
        </mesh>
        {/* Armrests */}
        <mesh position={[-0.8, 1.15, 0.02]} castShadow>
          <boxGeometry args={[0.26, 0.55, 1.4]} />
          <CozyMat color="#781D2B" />
        </mesh>
        <mesh position={[0.8, 1.15, 0.02]} castShadow>
          <boxGeometry args={[0.26, 0.55, 1.4]} />
          <CozyMat color="#781D2B" />
        </mesh>
        {/* 4 Turned Wooden Legs */}
        {[
          [-0.68, 0.24, -0.58],
          [0.68, 0.24, -0.58],
          [-0.68, 0.24, 0.58],
          [0.68, 0.24, 0.58]
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <cylinderGeometry args={[0.07, 0.05, 0.48, 12]} />
            <CozyMat color="#3D2111" />
          </mesh>
        ))}
        {/* Cozy Throw Pillow */}
        <mesh position={[0.3, 1.1, -0.35]} rotation={[0.2, 0.35, 0.1]} castShadow>
          <boxGeometry args={[0.55, 0.48, 0.22]} />
          <CozyMat color="#D4A373" roughness={0.9} />
        </mesh>
      </group>

      {/* --- Round Pedestal Tea Side Table --- */}
      <group position={[1.8, 0, 0.75]}>
        {/* Table Top */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 24]} />
          <CozyMat color="#502E19" roughness={0.5} />
        </mesh>
        {/* Center Turned Pedestal */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.14, 1.0, 12]} />
          <CozyMat color="#3D2111" />
        </mesh>
        {/* Base Plate */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.12, 16]} />
          <CozyMat color="#3D2111" />
        </mesh>
        {/* Steaming Tea Mug */}
        <mesh position={[0.1, 1.22, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.18, 16]} />
          <CozyMat color="#E3D5CA" />
        </mesh>
        <mesh position={[0.1, 1.28, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          <CozyMat color="#6F4E37" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * GardenBalconyBase (Level 10 Chamber)
 * Breezy open-air Mediterranean terrace: weathered terracotta pavers with tile grout,
 * classical stone balustrade with blooming planter boxes, panoramic rolling green hills vista,
 * climbing flowering ivy on rustic sandstone wall, and wrought-iron bistro set.
 */
export function GardenBalconyBase() {
  return (
    <group>
      {/* --- Weathered Terracotta Paver Floor (16x16) --- */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[16.0, 0.4, 16.0]} />
        <CozyMat color="#B85D3B" roughness={0.75} />
      </mesh>
      {/* Stone Tile Mortar Lines */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15.6, 15.6]} />
        <meshBasicMaterial color="#944528" wireframe transparent opacity={0.35} />
      </mesh>

      {/* --- Open Panoramic Vista (Rolling Green Hills & Bright Azure Sky) --- */}
      <group position={[0, 4.0, -9.2]}>
        {/* Sky Backdrop */}
        <mesh position={[0, 1.5, 0]}>
          <planeGeometry args={[26, 14]} />
          <CozyMat color="#60A5FA" emissive="#3B82F6" emissiveIntensity={0.4} />
        </mesh>
        {/* Distant Hills Layer 1 */}
        <mesh position={[2.5, -1.0, 0.1]} rotation={[0, 0, -0.04]}>
          <cylinderGeometry args={[12, 12, 4.5, 32, 1, false, 0, Math.PI]} />
          <CozyMat color="#4D7C0F" />
        </mesh>
        {/* Distant Hills Layer 2 */}
        <mesh position={[-4.5, -1.4, 0.2]} rotation={[0, 0, 0.06]}>
          <cylinderGeometry args={[10, 10, 4.0, 32, 1, false, 0, Math.PI]} />
          <CozyMat color="#365314" />
        </mesh>
      </group>

      {/* --- Classical Stone Balustrade (Back Railing across 16 units) --- */}
      <group position={[0, 0, -6.8]}>
        {/* Bottom Rail Plinth */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[16.0, 0.5, 0.55]} />
          <CozyMat color="#D6CEBE" roughness={0.8} />
        </mesh>
        {/* Top Handrail */}
        <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[16.0, 0.3, 0.6]} />
          <CozyMat color="#E5DFD3" roughness={0.75} />
        </mesh>
        {/* Baluster Pillars */}
        {[-7.0, -5.6, -4.2, -2.8, -1.4, 0, 1.4, 2.8, 4.2, 5.6, 7.0].map((x, i) => (
          <group key={i} position={[x, 0.9, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.12, 1.0, 12]} />
              <CozyMat color="#DCD5C7" />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <sphereGeometry args={[0.2, 12, 8]} />
              <CozyMat color="#DCD5C7" />
            </mesh>
          </group>
        ))}
        {/* Stone Planter Boxes with Lavender and Roses */}
        {[-4.0, 4.0].map((bx, bIdx) => (
          <group key={bIdx} position={[bx, 0.55, 0.4]} castShadow receiveShadow>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.8, 0.55, 0.7]} />
              <CozyMat color="#C4B8A6" />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[2.6, 0.1, 0.55]} />
              <CozyMat color="#3D291C" />
            </mesh>
            {[-0.9, -0.3, 0.3, 0.9].map((px, pIdx) => (
              <group key={pIdx} position={[px, 0.48, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.28, 10, 8]} />
                  <CozyMat color={pIdx % 2 === 0 ? '#437A3B' : '#558B2F'} />
                </mesh>
                <mesh position={[0, 0.22, 0]} castShadow>
                  <sphereGeometry args={[0.12, 8, 6]} />
                  <CozyMat color={pIdx % 2 === 0 ? '#F43F5E' : '#A855F7'} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* --- Left Wall: Rustic Sandstone Wall with Ivy Vines (16x7.5) --- */}
      <group position={[-7.8, 3.6, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.4, 7.6, 16.0]} />
          <CozyMat color="#C9BAA5" roughness={0.92} />
        </mesh>
        {/* Stone Archway Moulding */}
        <mesh position={[0.22, 2.8, 0]}>
          <boxGeometry args={[0.12, 0.28, 16.0]} />
          <CozyMat color="#DFD4C2" />
        </mesh>
        {/* Climbing Ivy & Violet Blossoms */}
        {[
          { y: 0.8, z: -2.4, s: 1.0 },
          { y: 1.8, z: -1.2, s: 1.2 },
          { y: 2.8, z: -1.8, s: 1.1 },
          { y: 1.2, z: 1.2, s: 1.0 },
          { y: 2.4, z: 1.8, s: 1.2 },
          { y: 3.5, z: 0.4, s: 0.9 }
        ].map((v, i) => (
          <group key={i} position={[0.22, v.y, v.z]} scale={v.s}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.06, 0.7, 0.7]} />
              <CozyMat color="#3A6335" />
            </mesh>
            <mesh position={[0.03, 0.15, 0.1]}>
              <sphereGeometry args={[0.12, 8, 6]} />
              <CozyMat color="#A855F7" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Ambient Floating Dust / Pollen Motes */}
      <FloatingDustMotes count={32} range={[12, 6.5, 12]} color="#FEF08A" />

      {/* --- Wrought-Iron Garden Bistro Table --- */}
      <group position={[0.5, 0, 0.4]}>
        {/* White Marble Top */}
        <mesh position={[0, 1.28, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.3, 0.1, 32]} />
          <CozyMat color="#F5F5F0" roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.22, 0]}>
          <cylinderGeometry args={[1.32, 1.32, 0.04, 32]} />
          <CozyMat color="#2B3A2C" />
        </mesh>
        {/* Pedestal Stand */}
        <mesh position={[0, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 1.2, 12]} />
          <CozyMat color="#2B3A2C" />
        </mesh>
        {/* 4 Curved Wrought-Iron Legs */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.45, 0.2, Math.sin(angle) * 0.45]}
            rotation={[0, angle, 0.35]}
            castShadow
          >
            <boxGeometry args={[0.1, 0.5, 0.1]} />
            <CozyMat color="#2B3A2C" />
          </mesh>
        ))}
        {/* Unrolled Cartography Map on Table */}
        <mesh position={[0.1, 1.34, 0.05]} rotation={[-Math.PI / 2, 0, 0.2]} receiveShadow>
          <planeGeometry args={[1.1, 0.75]} />
          <CozyMat color="#F5ECD7" roughness={0.9} />
        </mesh>
        {/* Glowing Prismatic Paperweight */}
        <mesh position={[0.45, 1.4, 0.18]} castShadow>
          <octahedronGeometry args={[0.12]} />
          <CozyMat color="#93C5FD" emissive="#60A5FA" emissiveIntensity={0.5} roughness={0.1} transparent opacity={0.85} />
        </mesh>
      </group>
    </group>
  );
}

// ==============================================================================
// 3D ITEM MODELS (CENTERED RELATIVE TO DESIGNATED PLACEMENT ANCHORS)
// ==============================================================================

/**
 * 1. Warm Desk Lamp
 */
export function DeskLampModel() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.28, 0.08, 16]} />
        <CozyMat color="#D4AF37" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.36, -0.05]} rotation={[-0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 10]} />
        <CozyMat color="#B58F28" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.62, -0.1]} castShadow>
        <sphereGeometry args={[0.06, 12, 12]} />
        <CozyMat color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.78, 0.1]} rotation={[0.6, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 10]} />
        <CozyMat color="#B58F28" metalness={0.7} roughness={0.3} />
      </mesh>
      <group position={[0, 0.9, 0.3]} rotation={[0.4, 0, 0]}>
        <mesh rotation={[Math.PI, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.1, 0.32, 16]} />
          <CozyMat color="#D16E50" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.08, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <CozyMat color="#FFF7C2" emissive="#FFA000" emissiveIntensity={2.5} />
        </mesh>
        <pointLight color="#FFA726" intensity={2.6} distance={7} castShadow shadow-bias={-0.001} />
      </group>
    </group>
  );
}

/**
 * 2. Ceremonial Matcha Bowl
 */
export function MatchaBowlModel() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.22, 0.28, 20]} />
        <CozyMat color="#2B3629" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.02, 20]} />
        <CozyMat color="#4E7C38" emissive="#2E4E20" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.32, 0.08, 0.15]} rotation={[0, 0.3, 1.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.045, 0.28, 10]} />
        <CozyMat color="#E8D8A8" roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * 3. Lo-Fi Cassette Player
 */
export function LoFiCassettePlayerModel() {
  const leftSpool = useRef();
  const rightSpool = useRef();

  useFrame((_, delta) => {
    if (leftSpool.current) leftSpool.current.rotation.z -= delta * 1.8;
    if (rightSpool.current) rightSpool.current.rotation.z -= delta * 1.8;
  });

  return (
    <group position={[0, 0.18, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.34, 0.45]} />
        <CozyMat color="#C8966E" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.03, 0.23]}>
        <boxGeometry args={[0.42, 0.2, 0.02]} />
        <CozyMat color="#1E1E1E" />
      </mesh>
      <group ref={leftSpool} position={[-0.1, 0.03, 0.245]}>
        <mesh>
          <cylinderGeometry args={[0.055, 0.055, 0.015, 12]} />
          <CozyMat color="#F5F5F5" />
        </mesh>
      </group>
      <group ref={rightSpool} position={[0.1, 0.03, 0.245]}>
        <mesh>
          <cylinderGeometry args={[0.055, 0.055, 0.015, 12]} />
          <CozyMat color="#F5F5F5" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 4. Potted Succulent
 */
export function PottedSucculentModel() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.16, 0.3, 16]} />
        <CozyMat color="#C86A4B" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
        <CozyMat color="#3E2723" />
      </mesh>
      {[0, Math.PI / 3, (Math.PI * 2) / 3, Math.PI, (Math.PI * 4) / 3, (Math.PI * 5) / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.1, 0.32, Math.sin(angle) * 0.1]}
          rotation={[0.3, angle, 0]}
          castShadow
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <CozyMat color="#5B8E7D" />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 5. Zen Bonsai Tree
 */
export function ZenBonsaiTreeModel() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.4, 0.14, 20]} />
        <CozyMat color="#263238" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 20]} />
        <CozyMat color="#3E2723" />
      </mesh>
      {/* Gnarled Trunk */}
      <mesh position={[0, 0.38, 0]} rotation={[0.15, 0.2, 0.1]} castShadow>
        <cylinderGeometry args={[0.08, 0.14, 0.48, 10]} />
        <CozyMat color="#5D4037" />
      </mesh>
      <mesh position={[0.15, 0.65, 0.05]} rotation={[-0.3, 0.3, 0.4]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.42, 10]} />
        <CozyMat color="#5D4037" />
      </mesh>
      {/* Foliage Pads */}
      <mesh position={[0.28, 0.85, 0.1]} castShadow>
        <sphereGeometry args={[0.26, 10, 8]} />
        <CozyMat color="#2E5A36" />
      </mesh>
      <mesh position={[-0.18, 0.62, -0.08]} castShadow>
        <sphereGeometry args={[0.2, 10, 8]} />
        <CozyMat color="#386A40" />
      </mesh>
    </group>
  );
}

/**
 * 6. Oak Bookshelf
 */
export function OakBookshelfModel() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 1.7, 0.55]} />
        <CozyMat color="#6D4C41" />
      </mesh>
      <mesh position={[0, 0.85, 0.06]}>
        <boxGeometry args={[1.15, 1.5, 0.45]} />
        <CozyMat color="#3E2723" />
      </mesh>
      {/* Shelf Divider */}
      <mesh position={[0, 0.85, 0.08]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.08, 0.48]} />
        <CozyMat color="#5D4037" />
      </mesh>
      {/* Lower Row Books */}
      <group position={[-0.45, 0.35, 0.12]}>
        {['#8E2828', '#274C77', '#B8860B', '#2D6A4F', '#6B4226'].map((col, idx) => (
          <mesh key={idx} position={[idx * 0.22, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.5, 0.32]} />
            <CozyMat color={col} />
          </mesh>
        ))}
      </group>
      {/* Upper Row Books */}
      <group position={[-0.42, 1.15, 0.12]}>
        {['#1F2937', '#78290F', '#4A5568', '#C05621'].map((col, idx) => (
          <mesh key={idx} position={[idx * 0.25, 0, 0]} castShadow>
            <boxGeometry args={[0.2, 0.46, 0.32]} />
            <CozyMat color={col} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * 7. Sleepy Calico Cat (Companion)
 */
export function SleepyCalicoCatModel() {
  const catRef = useRef();

  useFrame(({ clock }) => {
    if (!catRef.current) return;
    const t = clock.getElapsedTime();
    const breath = 1 + Math.sin(t * 2.2) * 0.05;
    catRef.current.scale.set(1, breath, 1);
  });

  return (
    <group ref={catRef} position={[0, 0, 0]}>
      {/* Sleeping Pillow / Bed */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.55, 0.58, 0.1, 20]} />
        <CozyMat color="#E2E8F0" roughness={0.9} />
      </mesh>
      {/* Curled Body */}
      <mesh position={[0, 0.18, 0]} rotation={[0, 0, 0.1]} castShadow>
        <sphereGeometry args={[0.34, 14, 12]} />
        <CozyMat color="#FFFFFF" />
      </mesh>
      {/* Orange & Black Calico Patches */}
      <mesh position={[0.12, 0.26, 0.14]} castShadow>
        <sphereGeometry args={[0.16, 10, 8]} />
        <CozyMat color="#D97706" />
      </mesh>
      <mesh position={[-0.14, 0.24, -0.1]} castShadow>
        <sphereGeometry args={[0.14, 10, 8]} />
        <CozyMat color="#1E293B" />
      </mesh>
      {/* Curled Head & Ears */}
      <mesh position={[0.24, 0.24, -0.05]} castShadow>
        <sphereGeometry args={[0.18, 12, 10]} />
        <CozyMat color="#FFFFFF" />
      </mesh>
      <mesh position={[0.3, 0.38, -0.14]} rotation={[0.4, 0, 0.3]} castShadow>
        <coneGeometry args={[0.06, 0.12, 6]} />
        <CozyMat color="#D97706" />
      </mesh>
      <mesh position={[0.3, 0.38, 0.04]} rotation={[-0.4, 0, 0.3]} castShadow>
        <coneGeometry args={[0.06, 0.12, 6]} />
        <CozyMat color="#1E293B" />
      </mesh>
      {/* Curled Tail */}
      <mesh position={[-0.32, 0.16, 0.05]} rotation={[0, 0.5, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.4, 10]} />
        <CozyMat color="#D97706" />
      </mesh>
    </group>
  );
}

/**
 * 8. Wise Study Owl (Companion)
 */
export function WiseStudyOwlModel() {
  const owlRef = useRef();

  useFrame(({ clock }) => {
    if (!owlRef.current) return;
    const t = clock.getElapsedTime();
    owlRef.current.rotation.y = Math.sin(t * 0.8) * 0.15;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Wooden Perch Stand */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.9, 10]} />
        <CozyMat color="#4E3320" />
      </mesh>
      <mesh position={[0, 0.88, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 10]} />
        <CozyMat color="#5D4037" />
      </mesh>
      {/* Animated Owl on Crossbar */}
      <group ref={owlRef} position={[0, 1.25, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.26, 12, 10]} />
          <CozyMat color="#78350F" />
        </mesh>
        {/* White Breast Plumes */}
        <mesh position={[0, -0.05, 0.18]}>
          <sphereGeometry args={[0.18, 10, 8]} />
          <CozyMat color="#FEF3C7" />
        </mesh>
        {/* Large Eyes */}
        <mesh position={[-0.1, 0.1, 0.22]}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <CozyMat color="#F59E0B" emissive="#D97706" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.1, 0.1, 0.22]}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <CozyMat color="#F59E0B" emissive="#D97706" emissiveIntensity={0.5} />
        </mesh>
        {/* Beak */}
        <mesh position={[0, 0.04, 0.27]} rotation={[0.4, 0, 0]}>
          <coneGeometry args={[0.04, 0.08, 6]} />
          <CozyMat color="#D97706" />
        </mesh>
        {/* Ear Tufts */}
        <mesh position={[-0.14, 0.28, 0.05]} rotation={[-0.2, 0, -0.4]} castShadow>
          <coneGeometry args={[0.05, 0.14, 6]} />
          <CozyMat color="#451A03" />
        </mesh>
        <mesh position={[0.14, 0.28, 0.05]} rotation={[-0.2, 0, 0.4]} castShadow>
          <coneGeometry args={[0.05, 0.14, 6]} />
          <CozyMat color="#451A03" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 9. Grandfather Clock (New)
 */
export function GrandfatherClockModel() {
  const pendulumRef = useRef();

  useFrame(({ clock }) => {
    if (!pendulumRef.current) return;
    const t = clock.getElapsedTime();
    pendulumRef.current.rotation.z = Math.sin(t * 3.14) * 0.2;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Plinth Base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.6, 0.7]} />
        <CozyMat color="#3D2111" />
      </mesh>
      {/* Mid Trunk with Glass Door */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 2.0, 0.6]} />
        <CozyMat color="#4E2A15" />
      </mesh>
      <mesh position={[0, 1.6, 0.28]}>
        <boxGeometry args={[0.5, 1.6, 0.05]} />
        <CozyMat color="#93C5FD" transparent opacity={0.35} roughness={0.1} />
      </mesh>
      {/* Swinging Pendulum */}
      <group ref={pendulumRef} position={[0, 2.3, 0.1]}>
        <mesh position={[0, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 1.1, 8]} />
          <CozyMat color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.15, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <CozyMat color="#D4AF37" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>
      {/* Upper Clock Hood & Face */}
      <mesh position={[0, 2.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.8, 0.7]} />
        <CozyMat color="#3D2111" />
      </mesh>
      {/* Dial Face */}
      <mesh position={[0, 2.9, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 24]} />
        <CozyMat color="#FEF3C7" roughness={0.4} />
      </mesh>
      {/* Top Pediment & Finial */}
      <mesh position={[0, 3.4, 0]} castShadow>
        <coneGeometry args={[0.1, 0.25, 8]} />
        <CozyMat color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * 10. Velvet Reading Armchair (New)
 */
export function ReadingArmchairModel() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.35, 1.3]} />
        <CozyMat color="#8B2635" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.78, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.2, 1.15]} />
        <CozyMat color="#9E2A3B" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.45, -0.52]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[1.3, 1.2, 0.3]} />
        <CozyMat color="#8B2635" roughness={0.8} />
      </mesh>
      <mesh position={[-0.72, 1.0, 0.02]} castShadow>
        <boxGeometry args={[0.22, 0.48, 1.2]} />
        <CozyMat color="#781D2B" />
      </mesh>
      <mesh position={[0.72, 1.0, 0.02]} castShadow>
        <boxGeometry args={[0.22, 0.48, 1.2]} />
        <CozyMat color="#781D2B" />
      </mesh>
      {/* 4 Wooden Turned Legs */}
      {[
        [-0.6, 0.2, -0.5],
        [0.6, 0.2, -0.5],
        [-0.6, 0.2, 0.5],
        [0.6, 0.2, 0.5]
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.06, 0.04, 0.4, 10]} />
          <CozyMat color="#3D2111" />
        </mesh>
      ))}
      <mesh position={[0.25, 0.95, -0.3]} rotation={[0.2, 0.3, 0.1]} castShadow>
        <boxGeometry args={[0.48, 0.42, 0.18]} />
        <CozyMat color="#D4A373" roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * 11. Vintage Brass Astrolabe (New)
 */
export function AstrolabeModel() {
  const innerRing = useRef();

  useFrame(({ clock }) => {
    if (!innerRing.current) return;
    const t = clock.getElapsedTime();
    innerRing.current.rotation.y = t * 0.4;
    innerRing.current.rotation.x = Math.sin(t * 0.5) * 0.2;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Heavy Stepped Brass Base */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.28, 0.1, 20]} />
        <CozyMat color="#D4AF37" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Vertical Support Stanchion */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 12]} />
        <CozyMat color="#B58F28" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Outer Meridian Ring */}
      <mesh position={[0, 0.58, 0]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.26, 0.02, 10, 32]} />
        <CozyMat color="#D4AF37" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Inner Revolving Armillary Rings */}
      <group ref={innerRing} position={[0, 0.58, 0]}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.22, 0.016, 8, 28]} />
          <CozyMat color="#E5C158" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
          <torusGeometry args={[0.18, 0.014, 8, 28]} />
          <CozyMat color="#D4AF37" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Central Starlight Pivot Sphere */}
        <mesh>
          <sphereGeometry args={[0.05, 12, 12]} />
          <CozyMat color="#FEF3C7" emissive="#FDE68A" emissiveIntensity={1.0} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 12. Monstera Deliciosa (New)
 */
export function MonsteraModel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Fluted Ceramic Planter */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.3, 0.7, 24]} />
        <CozyMat color="#F8FAFC" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.08, 20]} />
        <CozyMat color="#3D2614" />
      </mesh>
      {/* Broad Split Leaves Fan Out */}
      {[
        { rot: [0.35, 0.2, 0.4], pos: [0.25, 0.95, 0.1], s: 1.1 },
        { rot: [0.4, 2.2, -0.3], pos: [-0.2, 1.05, 0.2], s: 1.2 },
        { rot: [-0.3, -1.8, 0.5], pos: [-0.25, 0.9, -0.2], s: 0.95 },
        { rot: [-0.25, 0.8, -0.4], pos: [0.15, 1.15, -0.2], s: 1.3 },
        { rot: [0.1, 3.4, 0.2], pos: [0, 1.3, 0], s: 1.2 }
      ].map((lf, i) => (
        <group key={i} position={lf.pos} rotation={lf.rot} scale={lf.s} castShadow>
          {/* Stem */}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
            <CozyMat color="#2D5A27" />
          </mesh>
          {/* Broad Heart/Fenestrated Leaf */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <circleGeometry args={[0.35, 16]} />
            <CozyMat color="#1E4D2B" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 13. Starlight Candle Trio (New)
 */
export function CandleTrioModel() {
  const f1 = useRef();
  const f2 = useRef();
  const f3 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (f1.current) f1.current.scale.y = 1 + Math.sin(t * 8.0) * 0.15;
    if (f2.current) f2.current.scale.y = 1 + Math.sin(t * 7.2 + 1) * 0.15;
    if (f3.current) f3.current.scale.y = 1 + Math.sin(t * 9.1 + 2) * 0.15;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Brass Saucer Tray */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.38, 0.04, 20]} />
        <CozyMat color="#D4AF37" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Candle 1 (Tall) */}
      <group position={[-0.1, 0.04, -0.08]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 16]} />
          <CozyMat color="#FEF3C7" roughness={0.8} />
        </mesh>
        <group ref={f1} position={[0, 0.56, 0]}>
          <mesh>
            <coneGeometry args={[0.035, 0.1, 8]} />
            <CozyMat color="#FFA000" emissive="#FF6D00" emissiveIntensity={2.5} />
          </mesh>
        </group>
      </group>
      {/* Candle 2 (Medium) */}
      <group position={[0.12, 0.04, -0.04]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.36, 16]} />
          <CozyMat color="#FEF3C7" roughness={0.8} />
        </mesh>
        <group ref={f2} position={[0, 0.42, 0]}>
          <mesh>
            <coneGeometry args={[0.035, 0.1, 8]} />
            <CozyMat color="#FFA000" emissive="#FF6D00" emissiveIntensity={2.5} />
          </mesh>
        </group>
      </group>
      {/* Candle 3 (Short) */}
      <group position={[-0.02, 0.04, 0.12]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.24, 16]} />
          <CozyMat color="#FEF3C7" roughness={0.8} />
        </mesh>
        <group ref={f3} position={[0, 0.3, 0]}>
          <mesh>
            <coneGeometry args={[0.03, 0.09, 8]} />
            <CozyMat color="#FFA000" emissive="#FF6D00" emissiveIntensity={2.5} />
          </mesh>
        </group>
      </group>
      {/* Cozy Candle Warm Point Light */}
      <pointLight position={[0, 0.45, 0]} color="#FF9800" intensity={1.5} distance={4} />
    </group>
  );
}

/**
 * 14. Cozy Floor Pouf (New)
 */
export function FloorPoufModel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Chunky Knitted Pouf Cushion */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.65, 0.6, 20]} />
        <CozyMat color="#D97706" roughness={0.9} />
      </mesh>
      {/* Center Tufted Indentation */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.1, 12, 8]} />
        <CozyMat color="#92400E" />
      </mesh>
      {/* Radiating Knitted Segments */}
      {[0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4, Math.PI, (Math.PI * 5) / 4, (Math.PI * 3) / 2, (Math.PI * 7) / 4].map(
        (ang, i) => (
          <mesh
            key={i}
            position={[Math.cos(ang) * 0.4, 0.3, Math.sin(ang) * 0.4]}
            rotation={[0, -ang, 0]}
          >
            <boxGeometry args={[0.06, 0.58, 0.35]} />
            <CozyMat color="#B45309" roughness={0.95} />
          </mesh>
        )
      )}
    </group>
  );
}

/**
 * 15. Antique Gramophone (New)
 */
export function AntiqueGramophoneModel() {
  const vinylRef = useRef();

  useFrame(({ clock }) => {
    if (!vinylRef.current) return;
    vinylRef.current.rotation.y = clock.getElapsedTime() * 2.5;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Polished Mahogany Cabinet Base */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.44, 0.9]} />
        <CozyMat color="#4E2A15" roughness={0.4} />
      </mesh>
      {/* Brass Edge Trim */}
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[0.92, 0.04, 0.92]} />
        <CozyMat color="#D4AF37" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Revolving Turntable & Vinyl Disc */}
      <group ref={vinylRef} position={[0, 0.48, 0]}>
        <mesh>
          <cylinderGeometry args={[0.34, 0.34, 0.02, 24]} />
          <CozyMat color="#111827" roughness={0.2} />
        </mesh>
        {/* Record Label */}
        <mesh position={[0, 0.012, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.005, 16]} />
          <CozyMat color="#DC2626" />
        </mesh>
      </group>
      {/* Tone Arm & Fluted Brass Horn */}
      <mesh position={[0.3, 0.55, -0.2]} rotation={[0.2, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
        <CozyMat color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
      <group position={[0.2, 0.8, -0.15]} rotation={[-0.4, 0.5, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.42, 0.85, 18, 1, true]} />
          <CozyMat color="#F59E0B" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 16. Terracotta Herb Planter (New)
 */
export function HerbPlanterModel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Long Terracotta Trough */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.4, 0.5]} />
        <CozyMat color="#C86A4B" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[1.3, 0.06, 0.42]} />
        <CozyMat color="#3D291C" />
      </mesh>
      {/* Rosemary Sprigs (Left) */}
      {[-0.45, -0.35].map((x, i) => (
        <group key={i} position={[x, 0.55, 0]} castShadow>
          <mesh>
            <cylinderGeometry args={[0.08, 0.02, 0.35, 8]} />
            <CozyMat color="#2E5A36" />
          </mesh>
        </group>
      ))}
      {/* Garden Mint Bush (Center) */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <sphereGeometry args={[0.18, 10, 8]} />
        <CozyMat color="#4ADE80" />
      </mesh>
      {/* Flowering Thyme (Right) */}
      {[0.35, 0.45].map((x, i) => (
        <group key={i} position={[x, 0.5, 0]} castShadow>
          <mesh>
            <sphereGeometry args={[0.14, 8, 8]} />
            <CozyMat color="#86EFAC" />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <CozyMat color="#F472B6" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 17. Woven Persian Rug (New)
 */
export function PersianRugModel() {
  return (
    <group position={[0, 0.01, 0]} receiveShadow>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 2.2]} />
        <CozyMat color="#991B1B" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 1.8]} />
        <CozyMat color="#1E3A8A" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.3]} />
        <CozyMat color="#D97706" roughness={0.85} />
      </mesh>
      {/* White Fringe Tassels */}
      {[-1.62, 1.62].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 2.2]} />
          <CozyMat color="#FEF3C7" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 18. Loyal Shiba Inu (Companion New)
 */
export function LoyalShibaInuModel() {
  const tailRef = useRef();

  useFrame(({ clock }) => {
    if (!tailRef.current) return;
    tailRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 5.0) * 0.25;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Shiba Body */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.45, 0.7]} />
        <CozyMat color="#D97706" />
      </mesh>
      {/* White Chest / Bib */}
      <mesh position={[0, 0.32, 0.28]}>
        <boxGeometry args={[0.3, 0.35, 0.2]} />
        <CozyMat color="#FFFFFF" />
      </mesh>
      {/* Head */}
      <group position={[0, 0.65, 0.35]} castShadow>
        <mesh castShadow>
          <sphereGeometry args={[0.22, 12, 10]} />
          <CozyMat color="#D97706" />
        </mesh>
        {/* White Muzzle */}
        <mesh position={[0, -0.06, 0.16]}>
          <boxGeometry args={[0.16, 0.14, 0.18]} />
          <CozyMat color="#FFFFFF" />
        </mesh>
        {/* Black Nose & Eyes */}
        <mesh position={[0, -0.02, 0.26]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <CozyMat color="#111827" />
        </mesh>
        <mesh position={[-0.08, 0.06, 0.18]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <CozyMat color="#111827" />
        </mesh>
        <mesh position={[0.08, 0.06, 0.18]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <CozyMat color="#111827" />
        </mesh>
        {/* Pricked Triangle Ears */}
        <mesh position={[-0.12, 0.2, 0.02]} rotation={[0.1, 0, -0.3]} castShadow>
          <coneGeometry args={[0.07, 0.16, 4]} />
          <CozyMat color="#B45309" />
        </mesh>
        <mesh position={[0.12, 0.2, 0.02]} rotation={[0.1, 0, 0.3]} castShadow>
          <coneGeometry args={[0.07, 0.16, 4]} />
          <CozyMat color="#B45309" />
        </mesh>
      </group>
      {/* Sitting Legs */}
      {[
        [-0.18, 0.16, 0.24],
        [0.18, 0.16, 0.24],
        [-0.2, 0.12, -0.22],
        [0.2, 0.12, -0.22]
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.12, 0.32, 0.14]} />
          <CozyMat color="#D97706" />
        </mesh>
      ))}
      {/* Wagging Curled Tail */}
      <group ref={tailRef} position={[0, 0.52, -0.32]}>
        <mesh rotation={[0.6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.04, 0.35, 8]} />
          <CozyMat color="#FFFFFF" />
        </mesh>
      </group>
    </group>
  );
}

// Master map linking item names to their respective 3D model components
export const DECOR_MODELS_MAP = {
  'Warm Desk Lamp': DeskLampModel,
  'Ceremonial Matcha Bowl': MatchaBowlModel,
  'Lo-Fi Cassette Player': LoFiCassettePlayerModel,
  'Potted Succulent': PottedSucculentModel,
  'Zen Bonsai Tree': ZenBonsaiTreeModel,
  'Oak Bookshelf': OakBookshelfModel,
  'Sleepy Calico Cat': SleepyCalicoCatModel,
  'Wise Study Owl': WiseStudyOwlModel,
  'Grandfather Clock': GrandfatherClockModel,
  'Velvet Reading Armchair': ReadingArmchairModel,
  'Vintage Brass Astrolabe': AstrolabeModel,
  'Monstera Deliciosa': MonsteraModel,
  'Starlight Candle Trio': CandleTrioModel,
  'Cozy Floor Pouf': FloorPoufModel,
  'Antique Gramophone': AntiqueGramophoneModel,
  'Terracotta Herb Planter': HerbPlanterModel,
  'Woven Persian Rug': PersianRugModel,
  'Loyal Shiba Inu': LoyalShibaInuModel
};
