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
 * ReadingNookBase
 * Unlocked at Level 5.
 * Rich Oxford library atmosphere: dark walnut herringbone floor, deep forest green walls,
 * grand arched mahogany bookcase with rows of scholarly tomes, velvet reading armchair,
 * and a romantic dusk twilight window with glowing crescent moon and stars.
 */
export function ReadingNookBase() {
  return (
    <group>
      {/* --- Dark Walnut Herringbone Floor --- */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[7.6, 0.3, 7.6]} />
        <FlatMat color="#3D2617" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.4, 7.4]} />
        <meshBasicMaterial color="#2E1B0E" wireframe={true} transparent={true} opacity={0.3} />
      </mesh>

      {/* --- Back Wall (Deep Forest Library Green) --- */}
      <mesh position={[0, 2.5, -3.7]}>
        <boxGeometry args={[7.6, 5.0, 0.2]} />
        <FlatMat color="#1E382B" roughness={0.92} />
      </mesh>
      {/* Wall Picture Rail / Gold Moulding */}
      <mesh position={[0, 4.2, -3.58]}>
        <boxGeometry args={[7.6, 0.12, 0.08]} />
        <FlatMat color="#C69E52" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.15, -3.55]}>
        <boxGeometry args={[7.6, 0.3, 0.1]} />
        <FlatMat color="#2B180D" />
      </mesh>

      {/* --- Grand Built-in Mahogany Bookshelf along Back Wall --- */}
      <group position={[-1.2, 2.3, -3.45]}>
        {/* Frame Outer */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.2, 4.4, 0.45]} />
          <FlatMat color="#422513" />
        </mesh>
        {/* Bookshelf Cavity */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[3.9, 4.1, 0.38]} />
          <FlatMat color="#261409" />
        </mesh>
        {/* Shelves */}
        {[-1.3, -0.5, 0.3, 1.1].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0.08]}>
            <boxGeometry args={[3.9, 0.1, 0.4]} />
            <FlatMat color="#502E19" />
          </mesh>
        ))}
        {/* Decorative Rows of Books */}
        {/* Shelf 1 */}
        <group position={[-1.4, -1.05, 0.15]}>
          {[
            { c: '#8E2828', w: 0.14, h: 0.45 },
            { c: '#B8860B', w: 0.12, h: 0.48 },
            { c: '#274C77', w: 0.16, h: 0.42 },
            { c: '#2D6A4F', w: 0.13, h: 0.46 },
            { c: '#6B4226', w: 0.15, h: 0.4 },
            { c: '#78290F', w: 0.12, h: 0.47 },
          ].map((b, i) => (
            <mesh key={i} position={[i * 0.18, 0, 0]}>
              <boxGeometry args={[b.w, b.h, 0.28]} />
              <FlatMat color={b.c} />
            </mesh>
          ))}
        </group>
        {/* Shelf 2 */}
        <group position={[-0.8, -0.25, 0.15]}>
          {[
            { c: '#403D39', w: 0.15, h: 0.44 },
            { c: '#D4A373', w: 0.14, h: 0.41 },
            { c: '#588157', w: 0.13, h: 0.47 },
            { c: '#9A031E', w: 0.16, h: 0.49 },
            { c: '#1E3D59', w: 0.14, h: 0.43 },
          ].map((b, i) => (
            <mesh key={i} position={[i * 0.19, 0, 0]}>
              <boxGeometry args={[b.w, b.h, 0.28]} />
              <FlatMat color={b.c} />
            </mesh>
          ))}
        </group>
        {/* Shelf 3 */}
        <group position={[-1.3, 0.55, 0.15]}>
          {[
            { c: '#14213D', w: 0.15, h: 0.46 },
            { c: '#FCA311', w: 0.12, h: 0.43 },
            { c: '#386641', w: 0.14, h: 0.48 },
            { c: '#6F1D1B', w: 0.16, h: 0.44 },
            { c: '#99582A', w: 0.13, h: 0.41 },
          ].map((b, i) => (
            <mesh key={i} position={[i * 0.18, 0, 0]}>
              <boxGeometry args={[b.w, b.h, 0.28]} />
              <FlatMat color={b.c} />
            </mesh>
          ))}
        </group>
      </group>

      {/* --- Left Wall (Oxford Midnight Slate) --- */}
      <mesh position={[-3.7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5.0, 7.6]} />
        <FlatMat color="#1B263B" roughness={0.9} />
      </mesh>
      <mesh position={[-3.55, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.3, 7.6]} />
        <FlatMat color="#2B180D" />
      </mesh>

      {/* --- Arched Twilight / Dusk Window on Left Wall --- */}
      <group position={[-3.58, 2.9, 0.3]}>
        {/* Window Frame */}
        <mesh position={[0.02, 0, 0]}>
          <boxGeometry args={[0.1, 2.8, 2.1]} />
          <FlatMat color="#4A2E1B" />
        </mesh>
        {/* Twilight Sky Backing */}
        <mesh position={[0.04, 0, 0]}>
          <boxGeometry args={[0.04, 2.5, 1.8]} />
          <FlatMat color="#2A1B4E" roughness={0.3} emissive="#3B2668" emissiveIntensity={0.5} />
        </mesh>
        {/* Window Bars */}
        <mesh position={[0.06, 0, 0]}>
          <boxGeometry args={[0.03, 2.5, 0.08]} />
          <FlatMat color="#4A2E1B" />
        </mesh>
        <mesh position={[0.06, 0.2, 0]}>
          <boxGeometry args={[0.03, 0.08, 1.8]} />
          <FlatMat color="#4A2E1B" />
        </mesh>
        {/* Crescent Moon in Night Sky */}
        <group position={[0.05, 0.65, -0.3]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.2, 0.06, 8, 24, Math.PI * 1.3]} />
            <FlatMat color="#FFFBEB" emissive="#FFF4C4" emissiveIntensity={0.8} />
          </mesh>
        </group>
        {/* Glowing Distant Stars */}
        {[
          [0.05, 0.7, 0.4],
          [0.05, 0.3, -0.5],
          [0.05, -0.4, 0.3],
          [0.05, -0.6, -0.2],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.02, 0.05, 0.05]} />
            <FlatMat color="#FFE8A3" emissive="#FFE8A3" emissiveIntensity={1} />
          </mesh>
        ))}
      </group>

      {/* --- Victorian Emerald & Gold Rug --- */}
      <group position={[0.2, 0.015, 0.9]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 2.6]} />
          <FlatMat color="#194D33" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.8, 2.2]} />
          <FlatMat color="#D4AF37" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 1.9]} />
          <FlatMat color="#133C27" roughness={0.9} />
        </mesh>
      </group>

      {/* --- Plush Velvet Reading Armchair --- */}
      <group position={[-0.6, 0, 0.8]} rotation={[0, 0.4, 0]}>
        {/* Seat Base */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.3, 0.35, 1.2]} />
          <FlatMat color="#8B2635" roughness={0.85} />
        </mesh>
        {/* Plush Seat Cushion */}
        <mesh position={[0, 0.82, 0.05]}>
          <boxGeometry args={[1.15, 0.18, 1.05]} />
          <FlatMat color="#9E2A3B" roughness={0.9} />
        </mesh>
        {/* High Tufted Backrest */}
        <mesh position={[0, 1.35, -0.48]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[1.25, 1.1, 0.28]} />
          <FlatMat color="#8B2635" roughness={0.85} />
        </mesh>
        {/* Left Armrest */}
        <mesh position={[-0.65, 0.95, 0.02]}>
          <boxGeometry args={[0.22, 0.45, 1.15]} />
          <FlatMat color="#781D2B" />
        </mesh>
        {/* Right Armrest */}
        <mesh position={[0.65, 0.95, 0.02]}>
          <boxGeometry args={[0.22, 0.45, 1.15]} />
          <FlatMat color="#781D2B" />
        </mesh>
        {/* 4 Turned Wooden Legs */}
        {[
          [-0.55, 0.22, -0.45],
          [0.55, 0.22, -0.45],
          [-0.55, 0.22, 0.45],
          [0.55, 0.22, 0.45],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <cylinderGeometry args={[0.06, 0.04, 0.45, 10]} />
            <FlatMat color="#3D2111" />
          </mesh>
        ))}
        {/* Cozy Throw Pillow */}
        <mesh position={[0.25, 0.95, -0.28]} rotation={[0.2, 0.3, 0.1]}>
          <boxGeometry args={[0.45, 0.4, 0.18]} />
          <FlatMat color="#D4A373" roughness={0.9} />
        </mesh>
      </group>

      {/* --- Reading Side Table with Hot Tea --- */}
      <group position={[1.1, 0, 0.5]}>
        {/* Table Top */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.08, 24]} />
          <FlatMat color="#502E19" roughness={0.6} />
        </mesh>
        {/* Pedestal & Base */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.9, 12]} />
          <FlatMat color="#3D2111" />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.1, 16]} />
          <FlatMat color="#3D2111" />
        </mesh>
        {/* Saucer & Steaming Tea Mug */}
        <mesh position={[0, 1.01, 0]}>
          <cylinderGeometry args={[0.2, 0.16, 0.03, 16]} />
          <FlatMat color="#F5EBE0" />
        </mesh>
        <mesh position={[0, 1.11, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.18, 16]} />
          <FlatMat color="#E3D5CA" />
        </mesh>
        <mesh position={[0, 1.18, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          <FlatMat color="#6F4E37" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * GardenBalconyBase
 * Unlocked at Level 10.
 * Breezy Mediterranean terrace: weathered terracotta pavers, open-air classical stone balustrade,
 * rolling emerald hills vista, climbing flowering ivy, stone planter ledge, and wrought-iron bistro table.
 */
export function GardenBalconyBase() {
  return (
    <group>
      {/* --- Weathered Terracotta Paver Floor --- */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[7.6, 0.3, 7.6]} />
        <FlatMat color="#B85D3B" roughness={0.8} />
      </mesh>
      {/* Stone Tile Seams */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.4, 7.4]} />
        <meshBasicMaterial color="#944528" wireframe={true} transparent={true} opacity={0.35} />
      </mesh>

      {/* --- Open Panoramic Vista Backdrop (Rolling Green Hills & Blue Sky) --- */}
      <group position={[0, 2.5, -4.2]}>
        {/* Azure Horizon Sky */}
        <mesh position={[0, 1.2, 0]}>
          <planeGeometry args={[12, 7]} />
          <FlatMat color="#60A5FA" emissive="#3B82F6" emissiveIntensity={0.4} />
        </mesh>
        {/* Distant Rolling Hills Layer 1 */}
        <mesh position={[1.5, -0.5, 0.1]} rotation={[0, 0, -0.05]}>
          <cylinderGeometry args={[6, 6, 2.5, 32, 1, false, 0, Math.PI]} />
          <FlatMat color="#4D7C0F" />
        </mesh>
        {/* Distant Rolling Hills Layer 2 */}
        <mesh position={[-2.5, -0.7, 0.2]} rotation={[0, 0, 0.08]}>
          <cylinderGeometry args={[5, 5, 2.2, 32, 1, false, 0, Math.PI]} />
          <FlatMat color="#365314" />
        </mesh>
      </group>

      {/* --- Classical Stone Balustrade (Back Railing) --- */}
      <group position={[0, 0, -3.4]}>
        {/* Bottom Rail Plinth */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[7.6, 0.4, 0.45]} />
          <FlatMat color="#D6CEBE" roughness={0.85} />
        </mesh>
        {/* Top Handrail */}
        <mesh position={[0, 1.35, 0]}>
          <boxGeometry args={[7.6, 0.25, 0.5]} />
          <FlatMat color="#E5DFD3" roughness={0.8} />
        </mesh>
        {/* Baluster Pillars */}
        {[-3.2, -2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4, 3.2].map((x, i) => (
          <group key={i} position={[x, 0.78, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.09, 0.85, 12]} />
              <FlatMat color="#DCD5C7" />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.16, 12, 8]} />
              <FlatMat color="#DCD5C7" />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- Left Wall: Rustic Sandstone Wall with Ivy Vines --- */}
      <group position={[-3.7, 2.5, 0]}>
        <mesh>
          <boxGeometry args={[0.25, 5.0, 7.6]} />
          <FlatMat color="#C9BAA5" roughness={0.95} />
        </mesh>
        {/* Stone Moulding Trim */}
        <mesh position={[0.15, 1.8, 0]}>
          <boxGeometry args={[0.1, 0.2, 7.6]} />
          <FlatMat color="#DFD4C2" />
        </mesh>
        {/* Climbing Ivy Vine Groups */}
        {[
          { y: 0.8, z: -1.2, s: 0.7 },
          { y: 1.4, z: -0.7, s: 0.9 },
          { y: 2.1, z: -1.0, s: 0.8 },
          { y: 1.0, z: 0.5, s: 0.75 },
          { y: 1.8, z: 0.8, s: 0.85 },
          { y: 2.6, z: 0.3, s: 0.7 },
        ].map((v, i) => (
          <group key={i} position={[0.14, v.y, v.z]} scale={v.s}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.04, 0.5, 0.5]} />
              <FlatMat color="#3A6335" />
            </mesh>
            <mesh position={[0.02, 0.1, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[0.04, 0.4, 0.4]} />
              <FlatMat color="#4E7C47" />
            </mesh>
            {/* Violet blossom cluster */}
            <mesh position={[0.04, 0.15, 0.1]}>
              <sphereGeometry args={[0.08, 8, 6]} />
              <FlatMat color="#A855F7" />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- Stone Planter Boxes along the Balustrade --- */}
      <group position={[-2.2, 0.45, -3.1]}>
        <mesh>
          <boxGeometry args={[1.8, 0.45, 0.6]} />
          <FlatMat color="#C4B8A6" />
        </mesh>
        {/* Soil & Foliage */}
        <mesh position={[0, 0.24, 0]}>
          <boxGeometry args={[1.7, 0.08, 0.5]} />
          <FlatMat color="#3D291C" />
        </mesh>
        {[-0.6, -0.2, 0.2, 0.6].map((px, idx) => (
          <group key={idx} position={[px, 0.4, 0]}>
            <mesh>
              <sphereGeometry args={[0.22, 10, 8]} />
              <FlatMat color={idx % 2 === 0 ? '#437A3B' : '#558B2F'} />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <sphereGeometry args={[0.09, 8, 6]} />
              <FlatMat color={idx % 2 === 0 ? '#F43F5E' : '#FB7185'} />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- Wrought-Iron Garden Bistro Table --- */}
      <group position={[0.3, 0, 0.2]}>
        {/* Marble Table Top */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 0.08, 28]} />
          <FlatMat color="#EFECE6" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.21, 0]}>
          <cylinderGeometry args={[1.12, 1.12, 0.03, 28]} />
          <FlatMat color="#2B3A2C" />
        </mesh>
        {/* Pedestal Stand */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 1.2, 12]} />
          <FlatMat color="#2B3A2C" />
        </mesh>
        {/* 4 Curved Legs */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 0.4, 0.18, Math.sin(angle) * 0.4]} rotation={[0, angle, 0.35]}>
            <boxGeometry args={[0.08, 0.45, 0.08]} />
            <FlatMat color="#2B3A2C" />
          </mesh>
        ))}
        {/* Scholar's Cartography Map Unrolled on Balcony Table */}
        <mesh position={[0.1, 1.3, 0.05]} rotation={[-Math.PI / 2, 0, 0.2]}>
          <planeGeometry args={[0.9, 0.6]} />
          <FlatMat color="#F5ECD7" roughness={0.9} />
        </mesh>
        {/* Crystal Paperweight */}
        <mesh position={[0.4, 1.35, 0.15]}>
          <octahedronGeometry args={[0.1]} />
          <FlatMat color="#93C5FD" roughness={0.1} emissive="#60A5FA" emissiveIntensity={0.3} transparent={true} opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 1. Warm Desk Lamp
 * Brass base, curved stem, terracotta shade, warm emissive bulb + point light.
 */
export function DeskLampModel({ roomName = 'Study Desk' }) {
  const isReadingNook = roomName.includes('Reading') || roomName.includes('Nook');
  const isGardenBalcony = roomName.includes('Garden') || roomName.includes('Balcony');

  const position = isReadingNook 
    ? [1.25, 0.95, 0.3] 
    : isGardenBalcony 
    ? [-0.2, 1.25, -0.1] 
    : [-1.0, 1.4, -0.5];

  return (
    <group position={position}>
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
export function MatchaBowlModel({ roomName = 'Study Desk' }) {
  const steamRef1 = useRef();
  const steamRef2 = useRef();

  const isReadingNook = roomName.includes('Reading') || roomName.includes('Nook');
  const isGardenBalcony = roomName.includes('Garden') || roomName.includes('Balcony');

  const position = isReadingNook 
    ? [0.85, 0.95, 0.55] 
    : isGardenBalcony 
    ? [0.1, 1.25, 0.35] 
    : [-0.45, 1.4, -0.1];

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
    <group position={position}>
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
export function LoFiCassettePlayerModel({ roomName = 'Study Desk' }) {
  const spool1Ref = useRef();
  const spool2Ref = useRef();

  const isReadingNook = roomName.includes('Reading') || roomName.includes('Nook');
  const isGardenBalcony = roomName.includes('Garden') || roomName.includes('Balcony');

  const position = isReadingNook 
    ? [-0.1, 1.8, -3.3] 
    : isGardenBalcony 
    ? [0.55, 1.25, -0.05] 
    : [0.45, 1.4, -0.45];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 4;
    if (spool1Ref.current) spool1Ref.current.rotation.z = t;
    if (spool2Ref.current) spool2Ref.current.rotation.z = t;
  });

  return (
    <group position={position}>
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
export function PottedSucculentModel({ roomName = 'Study Desk' }) {
  const isReadingNook = roomName.includes('Reading') || roomName.includes('Nook');
  const isGardenBalcony = roomName.includes('Garden') || roomName.includes('Balcony');

  const position = isReadingNook 
    ? [-3.48, 1.5, 0.3] 
    : isGardenBalcony 
    ? [-1.4, 0.7, -3.1] 
    : [1.05, 1.4, 0.15];

  return (
    <group position={position}>
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
export function ZenBonsaiTreeModel({ roomName = 'Study Desk' }) {
  const isGardenBalcony = roomName.includes('Garden') || roomName.includes('Balcony');

  const position = isGardenBalcony 
    ? [-2.2, 0, 0.8] 
    : [-2.4, 0, 1.2];

  return (
    <group position={position}>
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
export function OakBookshelfModel({ roomName = 'Study Desk' }) {
  const isGardenBalcony = roomName.includes('Garden') || roomName.includes('Balcony');

  const position = isGardenBalcony 
    ? [2.5, 0, -2.8] 
    : [2.5, 0, -3.3];

  return (
    <group position={position}>
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
export function SleepyCalicoCatModel({ roomName = 'Study Desk' }) {
  const catRef = useRef();

  const isReadingNook = roomName.includes('Reading') || roomName.includes('Nook');
  const isGardenBalcony = roomName.includes('Garden') || roomName.includes('Balcony');

  const position = isReadingNook 
    ? [0.15, 0.05, 0.85] 
    : isGardenBalcony 
    ? [0.75, 0.05, 0.95] 
    : [0.35, 0.05, 1.1];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (catRef.current) {
      // Gentle breathing scale on Y and Z
      const breath = Math.sin(t * 2.2) * 0.05;
      catRef.current.scale.set(1 + breath * 0.5, 1 + breath, 1 + breath * 0.5);
    }
  });

  return (
    <group position={position}>
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
export function WiseStudyOwlModel({ roomName = 'Study Desk' }) {
  const headRef = useRef();
  const bodyRef = useRef();

  const isReadingNook = roomName.includes('Reading') || roomName.includes('Nook');

  const position = isReadingNook 
    ? [-2.4, 0, -1.8] 
    : [-2.4, 0, -2.2];

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
    <group position={position}>
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
