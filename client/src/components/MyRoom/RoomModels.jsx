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

/**
 * WoodMat
 * Warm wood material with subtle ambient warmth and low sheen.
 */
export const WoodMat = ({
  color = '#5D4037',
  roughness = 0.72,
  metalness = 0.04,
  emissive = '#1A0E06',
  emissiveIntensity = 0.12,
  ...props
}) => (
  <CozyMat
    color={color}
    roughness={roughness}
    metalness={metalness}
    emissive={emissive}
    emissiveIntensity={emissiveIntensity}
    {...props}
  />
);

/**
 * FabricMat
 * Soft plush textile material with high roughness and velvety light response.
 */
export const FabricMat = ({
  color = '#8B2635',
  roughness = 0.9,
  metalness = 0.02,
  ...props
}) => (
  <CozyMat
    color={color}
    roughness={roughness}
    metalness={metalness}
    {...props}
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

      {/* --- Elegant Woven Rectangular Hearth Rug --- */}
      <group position={[0.2, 0.005, 1.4]} receiveShadow>
        {/* Outer Warm Terracotta Border */}
        <mesh receiveShadow>
          <boxGeometry args={[4.8, 0.01, 3.4]} />
          <FabricMat color="#B85D3B" roughness={0.92} />
        </mesh>
        {/* Inner Cream Linen Field */}
        <mesh position={[0, 0.005, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.01, 2.8]} />
          <FabricMat color="#EDE4D3" roughness={0.9} />
        </mesh>
        {/* Subtle Warm Amber Center Accent */}
        <mesh position={[0, 0.009, 0]} receiveShadow>
          <boxGeometry args={[3.4, 0.005, 2.0]} />
          <FabricMat color="#C97A56" roughness={0.92} />
        </mesh>
      </group>

      {/* --- Base Large Executive Study Desk (Enhanced Model Fidelity) --- */}
      <group position={[0, 0, -0.6]}>
        {/* Main Desktop with Beveled Layered Edge Trim */}
        <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.16, 2.2]} />
          <CozyMat color="#8F5E38" roughness={0.48} />
        </mesh>
        {/* Upper Beveled Desktop Lip */}
        <mesh position={[0, 1.42, 0]} receiveShadow>
          <boxGeometry args={[4.88, 0.04, 2.28]} />
          <CozyMat color="#9B663E" roughness={0.45} />
        </mesh>
        {/* Underside Apron Molding */}
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[4.68, 0.05, 2.08]} />
          <CozyMat color="#6B4123" roughness={0.6} />
        </mesh>
        {/* Inlaid Leather Writing Pad with Stitched Border */}
        <mesh position={[-0.2, 1.45, 0.1]} receiveShadow>
          <boxGeometry args={[2.6, 0.02, 1.4]} />
          <CozyMat color="#2F1C0E" roughness={0.82} />
        </mesh>
        <mesh position={[-0.2, 1.455, 0.1]} receiveShadow>
          <boxGeometry args={[2.52, 0.005, 1.32]} />
          <CozyMat color="#3D2614" roughness={0.78} />
        </mesh>
        {/* Gold Filigree Inlay Border on Desk Perimeter */}
        <mesh position={[0, 1.442, 1.12]}>
          <boxGeometry args={[4.84, 0.015, 0.025]} />
          <CozyMat color="#DFB659" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.442, -1.12]}>
          <boxGeometry args={[4.84, 0.015, 0.025]} />
          <CozyMat color="#DFB659" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* 4 Turned Classical Legs with Brass Ferrule Cuffs */}
        {[
          [-2.2, 0.65, -0.95],
          [2.2, 0.65, -0.95],
          [-2.2, 0.65, 0.95],
          [2.2, 0.65, 0.95],
        ].map(([x, y, z], i) => (
          <group key={i} position={[x, 0, z]}>
            {/* Upper Leg Block */}
            <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.24, 0.22, 0.24]} />
              <CozyMat color="#59381E" />
            </mesh>
            {/* Turned Shaft with Center Swell */}
            <mesh position={[0, 0.68, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.12, 0.72, 14]} />
              <CozyMat color="#6B4224" roughness={0.52} />
            </mesh>
            <mesh position={[0, 0.68, 0]} castShadow>
              <sphereGeometry args={[0.13, 12, 8]} />
              <CozyMat color="#7E4E2C" roughness={0.5} />
            </mesh>
            {/* Lower Leg Post */}
            <mesh position={[0, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.08, 0.28, 12]} />
              <CozyMat color="#59381E" />
            </mesh>
            {/* Polished Brass Ferrule Foot */}
            <mesh position={[0, 0.05, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.09, 0.1, 14]} />
              <CozyMat color="#D4AF37" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
        {/* Dual Pedestal Drawers (Right side) with Raised Paneling */}
        <group position={[1.7, 0.8, 0]} castShadow receiveShadow>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.95, 1.9]} />
            <CozyMat color="#764929" />
          </mesh>
          {/* Raised Beveled Drawer Fronts */}
          {[-0.25, 0.25].map((dy, i) => (
            <group key={i} position={[-0.51, dy, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[0.03, 0.38, 1.76]} />
                <CozyMat color="#8F5A33" roughness={0.5} />
              </mesh>
              {/* Brass Rosette Backplate */}
              <mesh position={[-0.018, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.07, 0.07, 0.015, 12]} />
                <CozyMat color="#DFB659" metalness={0.75} roughness={0.25} />
              </mesh>
              {/* Teardrop Brass Pull Knob */}
              <mesh position={[-0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.035, 0.045, 0.06, 12]} />
                <CozyMat color="#DFB659" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>
        {/* Scholar's Stationery & Journal on Desk */}
        <group position={[-0.3, 1.47, 0.2]} rotation={[0, 0.12, 0]} castShadow>
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

      {/* --- Plush Velvet Reading Armchair (Enhanced Model Fidelity) --- */}
      <group position={[-1.2, 0, 1.2]} rotation={[0, 0.45, 0]}>
        {/* Seat Base with Padded Apron */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.42, 1.5]} />
          <CozyMat color="#8B2635" roughness={0.78} />
        </mesh>
        {/* Rounded Crown Front Apron */}
        <mesh position={[0, 0.65, 0.74]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 1.56, 16]} />
          <CozyMat color="#7E202E" roughness={0.75} />
        </mesh>
        {/* Plush Overstuffed Cushion */}
        <mesh position={[0, 0.9, 0.06]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.24, 1.3]} />
          <CozyMat color="#9E2A3B" roughness={0.82} />
        </mesh>
        {/* High Winged Tufted Backrest */}
        <mesh position={[0, 1.6, -0.6]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 1.4, 0.35]} />
          <CozyMat color="#8B2635" roughness={0.78} />
        </mesh>
        {/* Tufted Button Indentations on Backrest */}
        {[
          [-0.4, 1.8, -0.42],
          [0.0, 1.8, -0.42],
          [0.4, 1.8, -0.42],
          [-0.2, 1.5, -0.44],
          [0.2, 1.5, -0.44],
          [-0.4, 1.2, -0.46],
          [0.0, 1.2, -0.46],
          [0.4, 1.2, -0.46],
        ].map(([bx, by, bz], bi) => (
          <group key={bi} position={[bx, by, bz]}>
            <mesh castShadow>
              <sphereGeometry args={[0.04, 8, 6]} />
              <CozyMat color="#5C1420" roughness={0.9} />
            </mesh>
          </group>
        ))}
        {/* Elegant Rolled Armrests (Curved Cylinder Rolls) */}
        <group position={[-0.8, 1.15, 0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.48, 1.4]} />
            <CozyMat color="#781D2B" />
          </mesh>
          {/* Top Rolled Scroll Cushion */}
          <mesh position={[-0.04, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 1.42, 16]} />
            <CozyMat color="#8E2333" roughness={0.8} />
          </mesh>
          {/* Front Scroll Rosette */}
          <mesh position={[-0.04, 0.24, 0.72]}>
            <cylinderGeometry args={[0.13, 0.13, 0.04, 16]} />
            <CozyMat color="#D4AF37" metalness={0.65} roughness={0.35} />
          </mesh>
        </group>
        <group position={[0.8, 1.15, 0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.48, 1.4]} />
            <CozyMat color="#781D2B" />
          </mesh>
          {/* Top Rolled Scroll Cushion */}
          <mesh position={[0.04, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 1.42, 16]} />
            <CozyMat color="#8E2333" roughness={0.8} />
          </mesh>
          {/* Front Scroll Rosette */}
          <mesh position={[0.04, 0.24, 0.72]}>
            <cylinderGeometry args={[0.13, 0.13, 0.04, 16]} />
            <CozyMat color="#D4AF37" metalness={0.65} roughness={0.35} />
          </mesh>
        </group>
        {/* 4 Turned Dark Walnut Legs with Brass Casters */}
        {[
          [-0.68, 0.24, -0.58],
          [0.68, 0.24, -0.58],
          [-0.68, 0.24, 0.58],
          [0.68, 0.24, 0.58]
        ].map(([x, y, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.26, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.05, 0.44, 12]} />
              <CozyMat color="#3D2111" />
            </mesh>
            {/* Polished Brass Caster */}
            <mesh position={[0, 0.05, 0]} castShadow>
              <sphereGeometry args={[0.055, 10, 8]} />
              <CozyMat color="#D4AF37" metalness={0.8} roughness={0.25} />
            </mesh>
          </group>
        ))}
        {/* Cozy Embroidered Throw Pillow */}
        <mesh position={[0.3, 1.1, -0.35]} rotation={[0.2, 0.35, 0.1]} castShadow>
          <boxGeometry args={[0.55, 0.48, 0.22]} />
          <CozyMat color="#D4A373" roughness={0.88} />
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
      {/* Weighted Brass Base with Stepped Moulding & Felt Pad */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.29, 0.31, 0.04, 24]} />
        <CozyMat color="#1E1E1E" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.29, 0.05, 24]} />
        <CozyMat color="#D4AF37" metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 0.03, 20]} />
        <CozyMat color="#B58F28" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Brass Toggle / Rocker Switch on Base */}
      <mesh position={[0.12, 0.09, 0.1]} rotation={[0.2, 0.4, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.06]} />
        <CozyMat color="#D4AF37" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Lower Pivot Knuckle Joint with Brass Butterfly Wing Nut */}
      <group position={[0, 0.12, -0.02]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.08, 14]} />
          <CozyMat color="#DFB659" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={[0.02, 0.08, 0.02]} />
          <CozyMat color="#DFB659" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Lower Tapered Arm Segment */}
      <mesh position={[0, 0.38, -0.08]} rotation={[-0.22, 0, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.04, 0.54, 12]} />
        <CozyMat color="#B58F28" metalness={0.75} roughness={0.28} />
      </mesh>

      {/* Mid-Joint Knuckle */}
      <group position={[0, 0.65, -0.14]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.07, 14]} />
          <CozyMat color="#DFB659" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.045, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={[0.018, 0.075, 0.018]} />
          <CozyMat color="#DFB659" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Upper Curved Neck Segment */}
      <mesh position={[0, 0.82, 0.08]} rotation={[0.62, 0, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.035, 0.48, 12]} />
        <CozyMat color="#B58F28" metalness={0.75} roughness={0.28} />
      </mesh>

      {/* Fluted Shade with Rolled Brass Rim & Warm Amber Reflector */}
      <group position={[0, 0.94, 0.28]} rotation={[0.42, 0, 0]}>
        {/* Main Baked Terracotta / Sage Shade */}
        <mesh rotation={[Math.PI, 0, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.11, 0.34, 20]} />
          <CozyMat color="#D16E50" roughness={0.45} />
        </mesh>
        {/* Polished Brass Lip Trim */}
        <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.242, 0.016, 10, 24]} />
          <CozyMat color="#DFB659" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing Warm Filament Bulb */}
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <CozyMat color="#FFF7C2" emissive="#FFA000" emissiveIntensity={2.8} />
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
      {/* Glazed Ceramic Shallow Pot with Stepped Lip */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.54, 0.46, 0.16, 24]} />
        <CozyMat color="#1E293B" roughness={0.35} metalness={0.15} />
      </mesh>
      {/* Glazed Pot Lip Trim */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <torusGeometry args={[0.54, 0.025, 8, 24]} />
        <CozyMat color="#334155" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* 4 Ceramic Base Feet */}
      {[
        [-0.32, 0.015, -0.2],
        [0.32, 0.015, -0.2],
        [-0.32, 0.015, 0.2],
        [0.32, 0.015, 0.2]
      ].map(([fx, fy, fz], fi) => (
        <mesh key={fi} position={[fx, fy, fz]} castShadow>
          <boxGeometry args={[0.1, 0.04, 0.1]} />
          <CozyMat color="#1E293B" roughness={0.4} />
        </mesh>
      ))}

      {/* Rich Soil Bed */}
      <mesh position={[0, 0.155, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.02, 24]} />
        <CozyMat color="#2B1810" roughness={0.9} />
      </mesh>

      {/* Natural Velvet Moss Mounds */}
      {[
        [-0.22, 0.17, 0.1],
        [-0.05, 0.175, 0.22],
        [0.22, 0.168, -0.12],
        [0.12, 0.172, 0.2],
        [-0.2, 0.168, -0.18],
      ].map(([mx, my, mz], mi) => (
        <mesh key={mi} position={[mx, my, mz]} castShadow>
          <sphereGeometry args={[0.12 + (mi % 3) * 0.03, 10, 8]} />
          <CozyMat color={mi % 2 === 0 ? '#3B6B2B' : '#4E8538'} roughness={0.95} />
        </mesh>
      ))}

      {/* Miniature Zen River Stone (Suiseki) */}
      <mesh position={[0.26, 0.18, 0.12]} rotation={[0.2, 0.6, -0.1]} castShadow>
        <sphereGeometry args={[0.08, 10, 8]} />
        <CozyMat color="#64748B" roughness={0.6} />
      </mesh>

      {/* Root Flare (Nebari) */}
      <mesh position={[-0.08, 0.17, -0.04]} rotation={[0.4, 0.3, 0.6]} castShadow>
        <cylinderGeometry args={[0.04, 0.08, 0.18, 8]} />
        <WoodMat color="#4E342E" />
      </mesh>
      <mesh position={[0.06, 0.165, 0.08]} rotation={[-0.3, 0.5, -0.5]} castShadow>
        <cylinderGeometry args={[0.035, 0.07, 0.16, 8]} />
        <WoodMat color="#4E342E" />
      </mesh>

      {/* Gnarled Weathered Bonsai Trunk (Multi-Segment Twisting Pine) */}
      {/* Lower Trunk */}
      <mesh position={[0, 0.32, 0]} rotation={[0.16, 0.2, 0.12]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 0.32, 12]} />
        <WoodMat color="#5D4037" roughness={0.8} />
      </mesh>
      {/* Mid Trunk Lean */}
      <mesh position={[0.08, 0.56, 0.04]} rotation={[-0.24, 0.28, 0.38]} castShadow>
        <cylinderGeometry args={[0.075, 0.1, 0.32, 10]} />
        <WoodMat color="#5D4037" roughness={0.8} />
      </mesh>
      {/* Main Upper Right Limb */}
      <mesh position={[0.24, 0.78, 0.08]} rotation={[-0.15, 0.1, 0.52]} castShadow>
        <cylinderGeometry args={[0.05, 0.075, 0.34, 10]} />
        <WoodMat color="#4E342E" roughness={0.8} />
      </mesh>
      {/* Counter-Balance Left Branch */}
      <mesh position={[-0.06, 0.68, -0.04]} rotation={[0.22, -0.3, -0.65]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 8]} />
        <WoodMat color="#4E342E" roughness={0.8} />
      </mesh>
      {/* Back Depth Limb */}
      <mesh position={[0.04, 0.76, -0.12]} rotation={[-0.55, 0.1, 0.1]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.24, 8]} />
        <WoodMat color="#4E342E" roughness={0.8} />
      </mesh>

      {/* Layered Cloud Foliage Pads (Niwaki-Style Clustered Pine Tufts) */}
      {/* Apex Crown Cloud */}
      <group position={[0.38, 0.96, 0.12]}>
        <mesh castShadow>
          <sphereGeometry args={[0.26, 12, 10]} />
          <CozyMat color="#244F2C" roughness={0.85} />
        </mesh>
        <mesh position={[-0.08, 0.06, 0.06]} castShadow>
          <sphereGeometry args={[0.18, 10, 8]} />
          <CozyMat color="#2E6137" roughness={0.85} />
        </mesh>
        <mesh position={[0.08, -0.04, -0.04]} castShadow>
          <sphereGeometry args={[0.16, 10, 8]} />
          <CozyMat color="#1E4225" roughness={0.9} />
        </mesh>
      </group>

      {/* Mid Cascading Right Cloud */}
      <group position={[0.54, 0.82, 0.18]}>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 10, 8]} />
          <CozyMat color="#2E6137" roughness={0.85} />
        </mesh>
        <mesh position={[0.08, -0.04, 0.04]} castShadow>
          <sphereGeometry args={[0.14, 8, 6]} />
          <CozyMat color="#386A40" roughness={0.85} />
        </mesh>
      </group>

      {/* Counter-Balance Left Cloud */}
      <group position={[-0.24, 0.82, -0.08]}>
        <mesh castShadow>
          <sphereGeometry args={[0.22, 10, 8]} />
          <CozyMat color="#2B5932" roughness={0.85} />
        </mesh>
        <mesh position={[-0.06, 0.04, 0.05]} castShadow>
          <sphereGeometry args={[0.15, 8, 6]} />
          <CozyMat color="#386A40" roughness={0.85} />
        </mesh>
      </group>

      {/* Rear Depth Cloud */}
      <mesh position={[0.02, 0.88, -0.22]} castShadow>
        <sphereGeometry args={[0.18, 10, 8]} />
        <CozyMat color="#1E4024" roughness={0.9} />
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
      {/* Heavy Stepped Plinth Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.42, 0.2, 0.62]} />
        <WoodMat color="#4E342E" roughness={0.7} />
      </mesh>

      {/* Main Upright Carcase */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.34, 1.8, 0.56]} />
        <WoodMat color="#5D4037" roughness={0.72} />
      </mesh>

      {/* Recessed Book Cavity Backing Panel */}
      <mesh position={[0, 1.06, 0.05]}>
        <boxGeometry args={[1.18, 1.62, 0.46]} />
        <WoodMat color="#3E2723" roughness={0.85} />
      </mesh>

      {/* Fluted Side Stile Accents */}
      <mesh position={[-0.64, 1.05, 0.16]} castShadow>
        <boxGeometry args={[0.07, 1.76, 0.24]} />
        <WoodMat color="#4E342E" roughness={0.65} />
      </mesh>
      <mesh position={[0.64, 1.05, 0.16]} castShadow>
        <boxGeometry args={[0.07, 1.76, 0.24]} />
        <WoodMat color="#4E342E" roughness={0.65} />
      </mesh>

      {/* Crown Cornice Moulding Overhang */}
      <mesh position={[0, 1.98, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[1.46, 0.12, 0.64]} />
        <WoodMat color="#4E342E" roughness={0.65} />
      </mesh>
      <mesh position={[0, 1.92, 0.02]} castShadow>
        <boxGeometry args={[1.38, 0.06, 0.58]} />
        <WoodMat color="#5D4037" roughness={0.7} />
      </mesh>

      {/* Solid Oak Shelves (Lower & Upper) */}
      <mesh position={[0, 0.72, 0.07]} castShadow receiveShadow>
        <boxGeometry args={[1.18, 0.07, 0.5]} />
        <WoodMat color="#5D4037" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.34, 0.07]} castShadow receiveShadow>
        <boxGeometry args={[1.18, 0.07, 0.5]} />
        <WoodMat color="#5D4037" roughness={0.7} />
      </mesh>

      {/* === LOWER SHELF: Heavy Study Folios & Classic Volumes === */}
      <group position={[-0.48, 0.45, 0.12]}>
        {[
          { color: '#7F1D1D', w: 0.16, h: 0.46, d: 0.36, rib: true },
          { color: '#1E3A8A', w: 0.18, h: 0.5, d: 0.38, rib: true },
          { color: '#854D0E', w: 0.15, h: 0.44, d: 0.34, rib: false },
          { color: '#065F46', w: 0.19, h: 0.48, d: 0.36, rib: true },
          { color: '#3E2723', w: 0.22, h: 0.52, d: 0.4, rib: true },
          { color: '#581C87', w: 0.16, h: 0.45, d: 0.35, rib: false }
        ].map((book, idx) => {
          let curX = idx * 0.19;
          return (
            <group key={idx} position={[curX, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[book.w, book.h, book.d]} />
                <CozyMat color={book.color} roughness={0.75} />
              </mesh>
              {/* Embossed Gold Spine Ribbon / Title */}
              {book.rib && (
                <mesh position={[0, 0.06, book.d / 2 + 0.005]}>
                  <boxGeometry args={[book.w * 0.7, 0.06, 0.01]} />
                  <CozyMat color="#D4AF37" metalness={0.7} roughness={0.3} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      {/* === MIDDLE SHELF: Vintage Hardcovers + Crystal Artifact === */}
      <group position={[-0.46, 1.03, 0.12]}>
        {[
          { color: '#1E293B', w: 0.14, h: 0.42, d: 0.32 },
          { color: '#991B1B', w: 0.16, h: 0.45, d: 0.34 },
          { color: '#15803D', w: 0.14, h: 0.4, d: 0.3 },
          { color: '#B45309', w: 0.15, h: 0.43, d: 0.32 }
        ].map((book, idx) => (
          <mesh key={idx} position={[idx * 0.17, 0, 0]} castShadow>
            <boxGeometry args={[book.w, book.h, book.d]} />
            <CozyMat color={book.color} roughness={0.7} />
          </mesh>
        ))}

        {/* Luminous Amethyst Geode Trinket on Middle Shelf */}
        <group position={[0.78, -0.05, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.09, 0.12, 0.05, 12]} />
            <CozyMat color="#334155" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.1, 0]} castShadow>
            <octahedronGeometry args={[0.11]} />
            <CozyMat color="#C084FC" emissive="#9333EA" emissiveIntensity={1.4} roughness={0.3} metalness={0.4} />
          </mesh>
        </group>
      </group>

      {/* === UPPER SHELF: Scholarly Tomes with Leaning Book & Brass Bookend === */}
      <group position={[-0.44, 1.62, 0.12]}>
        {[
          { color: '#312E81', w: 0.14, h: 0.42, d: 0.32 },
          { color: '#701A75', w: 0.15, h: 0.44, d: 0.33 },
          { color: '#14532D', w: 0.13, h: 0.38, d: 0.3 },
        ].map((book, idx) => (
          <mesh key={idx} position={[idx * 0.16, 0, 0]} castShadow>
            <boxGeometry args={[book.w, book.h, book.d]} />
            <CozyMat color={book.color} roughness={0.7} />
          </mesh>
        ))}
        {/* Leaning Tome */}
        <mesh position={[0.54, -0.02, 0]} rotation={[0, 0, -0.25]} castShadow>
          <boxGeometry args={[0.13, 0.4, 0.32]} />
          <CozyMat color="#C2410C" roughness={0.75} />
        </mesh>
        {/* Polished Brass Scroll Bookend */}
        <group position={[0.76, -0.06, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.16, 0.28]} />
            <CozyMat color="#D4AF37" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
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
    pendulumRef.current.rotation.z = Math.sin(t * 3.14) * 0.18;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Plinth Base with Stepped Moulding */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.08, 0.28, 0.74]} />
        <WoodMat color="#3D2111" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.96, 0.22, 0.66]} />
        <WoodMat color="#4E2A15" roughness={0.65} />
      </mesh>
      {/* 4 Carved Base Bracket Feet */}
      {[
        [-0.48, 0.05, -0.3],
        [0.48, 0.05, -0.3],
        [-0.48, 0.05, 0.3],
        [0.48, 0.05, 0.3]
      ].map(([bx, by, bz], bi) => (
        <mesh key={bi} position={[bx, by, bz]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <WoodMat color="#3D2111" roughness={0.7} />
        </mesh>
      ))}

      {/* Mid Trunk Waist with Fluted Columns */}
      <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 2.12, 0.58]} />
        <WoodMat color="#4E2A15" roughness={0.7} />
      </mesh>
      {/* Side Column Pillars */}
      <mesh position={[-0.38, 1.55, 0.26]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.05, 12]} />
        <WoodMat color="#3D2111" roughness={0.6} />
      </mesh>
      <mesh position={[0.38, 1.55, 0.26]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.05, 12]} />
        <WoodMat color="#3D2111" roughness={0.6} />
      </mesh>

      {/* Beveled Brass-Framed Glass Door */}
      <mesh position={[0, 1.55, 0.29]}>
        <boxGeometry args={[0.56, 1.76, 0.04]} />
        <CozyMat color="#D4AF37" metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.55, 0.305]}>
        <boxGeometry args={[0.48, 1.68, 0.01]} />
        <CozyMat color="#93C5FD" transparent opacity={0.32} roughness={0.08} />
      </mesh>

      {/* Hanging Brass Chime Weights (Left & Right) */}
      <mesh position={[-0.14, 1.75, 0.08]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.44, 14]} />
        <CozyMat color="#DFB659" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0.14, 1.6, 0.08]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.44, 14]} />
        <CozyMat color="#DFB659" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Weight Suspension Chains */}
      <mesh position={[-0.14, 2.12, 0.08]}>
        <cylinderGeometry args={[0.005, 0.005, 0.32, 6]} />
        <CozyMat color="#D4AF37" metalness={0.8} />
      </mesh>
      <mesh position={[0.14, 2.05, 0.08]}>
        <cylinderGeometry args={[0.005, 0.005, 0.46, 6]} />
        <CozyMat color="#D4AF37" metalness={0.8} />
      </mesh>

      {/* Swinging Lyre Pendulum */}
      <group ref={pendulumRef} position={[0, 2.3, 0.12]}>
        {/* Brass Pendulum Rod */}
        <mesh position={[0, -0.62, 0]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 1.22, 8]} />
          <CozyMat color="#DFB659" metalness={0.85} roughness={0.18} />
        </mesh>
        {/* Lyre Decorative Frame Accent */}
        <mesh position={[0, -0.55, 0]}>
          <torusGeometry args={[0.07, 0.01, 8, 16]} />
          <CozyMat color="#DFB659" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Heavy Polished Disc Bob */}
        <mesh position={[0, -1.24, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.04, 24]} />
          <CozyMat color="#DFB659" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* Upper Clock Bonnet Hood & Cornice */}
      <mesh position={[0, 2.92, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.04, 0.78, 0.72]} />
        <WoodMat color="#4E2A15" roughness={0.65} />
      </mesh>

      {/* Polished Brass Bezel Dial Surround */}
      <mesh position={[0, 2.92, 0.36]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.29, 0.025, 10, 32]} />
        <CozyMat color="#DFB659" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Aged Porcelain Clock Face */}
      <mesh position={[0, 2.92, 0.362]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.015, 32]} />
        <CozyMat color="#FFFDF0" roughness={0.4} />
      </mesh>

      {/* Center Golden Sunburst Medallion */}
      <mesh position={[0, 2.92, 0.375]}>
        <sphereGeometry args={[0.045, 12, 10]} />
        <CozyMat color="#D4AF37" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* 12 Roman Numeral Hour Markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * Math.PI) / 6;
        const radius = 0.21;
        const x = Math.sin(angle) * radius;
        const y = Math.cos(angle) * radius;
        return (
          <mesh key={i} position={[x, 2.92 + y, 0.372]} rotation={[0, 0, -angle]}>
            <boxGeometry args={[0.014, 0.038, 0.005]} />
            <CozyMat color="#1E1E1E" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Delicate Antique Clock Hands (Set at 10:10) */}
      {/* Hour Hand (pointing toward ~10) */}
      <mesh position={[-0.065, 2.96, 0.378]} rotation={[0, 0, 0.52]}>
        <boxGeometry args={[0.015, 0.12, 0.006]} />
        <CozyMat color="#2B1810" roughness={0.5} />
      </mesh>
      {/* Minute Hand (pointing toward ~2) */}
      <mesh position={[0.08, 2.99, 0.38]} rotation={[0, 0, -0.52]}>
        <boxGeometry args={[0.012, 0.17, 0.006]} />
        <CozyMat color="#2B1810" roughness={0.5} />
      </mesh>

      {/* Ornate Swan-Neck Broken Pediment with 3 Polished Brass Finials */}
      <mesh position={[0, 3.36, 0.05]} castShadow>
        <boxGeometry args={[1.08, 0.1, 0.74]} />
        <WoodMat color="#3D2111" roughness={0.65} />
      </mesh>
      {/* Center Brass Urn Finial */}
      <mesh position={[0, 3.52, 0.05]} castShadow>
        <coneGeometry args={[0.08, 0.22, 12]} />
        <CozyMat color="#DFB659" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 3.42, 0.05]} castShadow>
        <sphereGeometry args={[0.05, 10, 8]} />
        <CozyMat color="#DFB659" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Left & Right Corner Finials */}
      <mesh position={[-0.48, 3.48, 0.05]} castShadow>
        <coneGeometry args={[0.055, 0.15, 10]} />
        <CozyMat color="#DFB659" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0.48, 3.48, 0.05]} castShadow>
        <coneGeometry args={[0.055, 0.15, 10]} />
        <CozyMat color="#DFB659" metalness={0.85} roughness={0.2} />
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
      {/* Main Seat Base Frame */}
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.44, 0.32, 1.34]} />
        <FabricMat color="#781D2B" roughness={0.9} />
      </mesh>

      {/* Plush Welted Seat Cushion */}
      <mesh position={[0, 0.76, 0.04]} castShadow receiveShadow>
        <boxGeometry args={[1.24, 0.22, 1.18]} />
        <FabricMat color="#8E2333" roughness={0.88} />
      </mesh>

      {/* Arched Chesterfield Wingback Backrest */}
      <mesh position={[0, 1.5, -0.5]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[1.34, 1.3, 0.28]} />
        <FabricMat color="#851F2F" roughness={0.9} />
      </mesh>
      {/* Wingback Side Wings */}
      <mesh position={[-0.64, 1.55, -0.28]} rotation={[-0.08, 0.25, 0]} castShadow>
        <boxGeometry args={[0.16, 1.1, 0.44]} />
        <FabricMat color="#781D2B" roughness={0.9} />
      </mesh>
      <mesh position={[0.64, 1.55, -0.28]} rotation={[-0.08, -0.25, 0]} castShadow>
        <boxGeometry args={[0.16, 1.1, 0.44]} />
        <FabricMat color="#781D2B" roughness={0.9} />
      </mesh>

      {/* Tufted Button Indentations on Backrest */}
      {[
        [-0.4, 1.84, -0.44],
        [0.0, 1.84, -0.44],
        [0.4, 1.84, -0.44],
        [-0.2, 1.54, -0.47],
        [0.2, 1.54, -0.47],
        [-0.4, 1.24, -0.5],
        [0.0, 1.24, -0.5],
        [0.4, 1.24, -0.5],
      ].map(([bx, by, bz], bi) => (
        <mesh key={bi} position={[bx, by, bz]} castShadow>
          <sphereGeometry args={[0.04, 8, 6]} />
          <FabricMat color="#50121C" roughness={0.95} />
        </mesh>
      ))}

      {/* Elegant Rolled Armrests with Front Rosettes */}
      <group position={[-0.78, 1.08, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.44, 1.32]} />
          <FabricMat color="#781D2B" roughness={0.9} />
        </mesh>
        {/* Rolled Cylinder Top */}
        <mesh position={[-0.03, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 1.34, 16]} />
          <FabricMat color="#8E2333" roughness={0.88} />
        </mesh>
        {/* Front Brass Rosette Stud */}
        <mesh position={[-0.03, 0.22, 0.68]}>
          <cylinderGeometry args={[0.12, 0.12, 0.03, 16]} />
          <CozyMat color="#D4AF37" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      <group position={[0.78, 1.08, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.44, 1.32]} />
          <FabricMat color="#781D2B" roughness={0.9} />
        </mesh>
        {/* Rolled Cylinder Top */}
        <mesh position={[0.03, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 1.34, 16]} />
          <FabricMat color="#8E2333" roughness={0.88} />
        </mesh>
        {/* Front Brass Rosette Stud */}
        <mesh position={[0.03, 0.22, 0.68]}>
          <cylinderGeometry args={[0.12, 0.12, 0.03, 16]} />
          <CozyMat color="#D4AF37" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* 4 Turned Dark Walnut Legs with Brass Casters */}
      {[
        [-0.64, 0, -0.54],
        [0.64, 0, -0.54],
        [-0.64, 0, 0.54],
        [0.64, 0, 0.54]
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.045, 0.38, 12]} />
            <WoodMat color="#3D2111" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.04, 0]} castShadow>
            <sphereGeometry args={[0.045, 10, 8]} />
            <CozyMat color="#D4AF37" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Cozy Embroidered Throw Pillow */}
      <mesh position={[0.28, 1.02, -0.32]} rotation={[0.18, 0.32, 0.1]} castShadow>
        <boxGeometry args={[0.5, 0.44, 0.2]} />
        <FabricMat color="#D4A373" roughness={0.92} />
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
