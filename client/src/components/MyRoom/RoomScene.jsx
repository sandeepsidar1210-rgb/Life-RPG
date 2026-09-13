import React from 'react';
import {
  RoomBase,
  DeskLampModel,
  MatchaBowlModel,
  LoFiCassettePlayerModel,
  PottedSucculentModel,
  ZenBonsaiTreeModel,
  OakBookshelfModel,
  SleepyCalicoCatModel,
  WiseStudyOwlModel
} from './RoomModels.jsx';
import { AnimatedSpawnItem } from './AnimatedSpawnItem.jsx';

/**
 * RoomScene
 * Manages lighting and placing the base low-poly room + dynamically equipped decor/companion items.
 */
export function RoomScene({ equippedNames = new Set() }) {
  const isEquipped = (name) => equippedNames.has(name);

  return (
    <>
      {/* --- Ambient & Directional Lighting --- */}
      {/* Soft warm overall room illumination */}
      <ambientLight intensity={0.78} color="#FFF9F0" />

      {/* Gentle sunlight streaming in from the window on the left wall */}
      <directionalLight
        position={[-6, 7, 2]}
        intensity={1.15}
        color="#FFF1D6"
      />

      {/* Soft fill light from the open front/right */}
      <directionalLight
        position={[5, 6, 6]}
        intensity={0.45}
        color="#EDE5D5"
      />

      {/* Ceiling bounce light */}
      <pointLight position={[0, 4.2, 0]} intensity={0.3} color="#FFE6CA" distance={8} />

      {/* --- Foundation Room Geometry & Furniture --- */}
      <RoomBase />

      {/* --- 3D Equippable Decor Items (Spawn with Bounce Animation) --- */}
      <AnimatedSpawnItem isEquipped={isEquipped('Warm Desk Lamp')}>
        <DeskLampModel />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Ceremonial Matcha Bowl')}>
        <MatchaBowlModel />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Lo-Fi Cassette Player')}>
        <LoFiCassettePlayerModel />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Potted Succulent')}>
        <PottedSucculentModel />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Zen Bonsai Tree')}>
        <ZenBonsaiTreeModel />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Oak Bookshelf')}>
        <OakBookshelfModel />
      </AnimatedSpawnItem>

      {/* --- 3D Equippable Companions (Animated) --- */}
      <AnimatedSpawnItem isEquipped={isEquipped('Sleepy Calico Cat')}>
        <SleepyCalicoCatModel />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Wise Study Owl')}>
        <WiseStudyOwlModel />
      </AnimatedSpawnItem>
    </>
  );
}
