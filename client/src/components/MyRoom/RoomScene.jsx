import React from 'react';
import {
  RoomBase,
  ReadingNookBase,
  GardenBalconyBase,
  DeskLampModel,
  MatchaBowlModel,
  LoFiCassettePlayerModel,
  PottedSucculentModel,
  ZenBonsaiTreeModel,
  OakBookshelfModel,
  SleepyCalicoCatModel,
  WiseStudyOwlModel
} from './RoomModels.jsx';
import { SpiritCompanion } from './SpiritModels.jsx';
import { AnimatedSpawnItem } from './AnimatedSpawnItem.jsx';

/**
 * RoomScene
 * Manages lighting and placing the base low-poly room + dynamically equipped decor/companion items.
 * Adapts lighting, background vista, and foundation architecture per active room:
 * - Study Desk: Warm parchment tones & sunny morning desk.
 * - Reading Nook: Deep forest green library, glowing stars, dusk crescent moon, velvet armchair.
 * - Garden Balcony: Sunlit open-air terrace, classical balustrade, rolling hills, flowering ivy.
 */
export function RoomScene({ equippedNames = new Set(), roomName = 'Study Desk', spiritModelKey = null, onGreet = null }) {
  const isEquipped = (name) => equippedNames.has(name);

  // Determine room theme
  const isReadingNook = roomName.includes('Reading') || roomName.includes('Nook');
  const isGardenBalcony = roomName.includes('Garden') || roomName.includes('Balcony');

  return (
    <>
      {/* --- Ambient & Directional Lighting Per Room --- */}
      {isReadingNook ? (
        <>
          {/* Moody, warm library twilight illumination */}
          <ambientLight intensity={0.65} color="#D8CEEF" />
          <directionalLight position={[-6, 7, 2]} intensity={0.8} color="#8A76BC" />
          <directionalLight position={[5, 6, 6]} intensity={0.4} color="#C4B5FD" />
          {/* Warm reading amber lamp glow */}
          <pointLight position={[-0.6, 2.2, 0.8]} intensity={0.75} color="#FFE0B2" distance={6} />
        </>
      ) : isGardenBalcony ? (
        <>
          {/* Sun-drenched open air terrace illumination */}
          <ambientLight intensity={0.92} color="#E0F2FE" />
          <directionalLight position={[-5, 9, 3]} intensity={1.4} color="#FEF08A" />
          <directionalLight position={[6, 5, 5]} intensity={0.55} color="#BAE6FD" />
          {/* Warm terrace bounce light */}
          <pointLight position={[0.3, 2.5, 0.2]} intensity={0.4} color="#FED7AA" distance={9} />
        </>
      ) : (
        <>
          {/* Classical Cozy Study Desk Daylight */}
          <ambientLight intensity={0.78} color="#FFF9F0" />
          <directionalLight position={[-6, 7, 2]} intensity={1.15} color="#FFF1D6" />
          <directionalLight position={[5, 6, 6]} intensity={0.45} color="#EDE5D5" />
          <pointLight position={[0, 4.2, 0]} intensity={0.3} color="#FFE6CA" distance={8} />
        </>
      )}

      {/* --- Foundation Room Geometry & Furniture --- */}
      {isReadingNook ? (
        <ReadingNookBase />
      ) : isGardenBalcony ? (
        <GardenBalconyBase />
      ) : (
        <RoomBase />
      )}

      {/* --- 3D Equippable Decor Items (Spawn with Bounce Animation) --- */}
      <AnimatedSpawnItem isEquipped={isEquipped('Warm Desk Lamp')}>
        <DeskLampModel roomName={roomName} />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Ceremonial Matcha Bowl')}>
        <MatchaBowlModel roomName={roomName} />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Lo-Fi Cassette Player')}>
        <LoFiCassettePlayerModel roomName={roomName} />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Potted Succulent')}>
        <PottedSucculentModel roomName={roomName} />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Zen Bonsai Tree')}>
        <ZenBonsaiTreeModel roomName={roomName} />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Oak Bookshelf')}>
        <OakBookshelfModel roomName={roomName} />
      </AnimatedSpawnItem>

      {/* --- Study Spirit Companion (Active Stage 3D Model) --- */}
      {spiritModelKey && (
        <SpiritCompanion modelKey={spiritModelKey} roomName={roomName} onGreet={onGreet} />
      )}

      {/* --- 3D Equippable Companions (Animated) --- */}
      <AnimatedSpawnItem isEquipped={isEquipped('Sleepy Calico Cat')}>
        <SleepyCalicoCatModel roomName={roomName} />
      </AnimatedSpawnItem>

      <AnimatedSpawnItem isEquipped={isEquipped('Wise Study Owl')}>
        <WiseStudyOwlModel roomName={roomName} />
      </AnimatedSpawnItem>
    </>
  );
}

export default RoomScene;
