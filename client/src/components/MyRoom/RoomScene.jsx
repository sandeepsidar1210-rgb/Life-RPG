import React, { useMemo } from 'react';
import {
  RoomBase,
  ReadingNookBase,
  GardenBalconyBase,
  DECOR_MODELS_MAP
} from './RoomModels.jsx';
import { SpiritCompanion } from './SpiritModels.jsx';
import { AnimatedSpawnItem } from './AnimatedSpawnItem.jsx';
import { resolveRoomPlacements, COMPANION_SPOTS } from './placementZones.js';

/**
 * RoomScene
 * Manages lighting and placing the base low-poly room + dynamically equipped decor/companion items.
 * Implements standard 3-point soft-shadow lighting, designated anchor zone placement,
 * and distinct rich atmospheric environments per chamber:
 * - Study Desk: Golden morning daylight, soft sky bounce, deep oak trims.
 * - Reading Nook: Rich warm amber key light, soft lavender fill, glowing crescent moon & stars (fixed darkness bug).
 * - Garden Balcony: Mediterranean sun-drenched terrace, azure sky bounce, open-air hills vista.
 */
export function RoomScene({
  equippedNames = new Set(),
  roomName = 'Study Desk',
  spiritModelKey = null,
  onGreet = null
}) {
  // Determine normalized room chamber
  const isReadingNook = roomName.includes('Reading') || roomName.includes('Nook');
  const isGardenBalcony = roomName.includes('Garden') || roomName.includes('Balcony');
  const normalizedRoom = isReadingNook ? 'Reading Nook' : isGardenBalcony ? 'Garden Balcony' : 'Study Desk';

  // Resolve deterministic non-overlapping zone placements for equipped decor
  const { itemPlacements } = useMemo(() => {
    return resolveRoomPlacements(equippedNames, normalizedRoom);
  }, [equippedNames, normalizedRoom]);

  // Companions and their dedicated anchor spots
  const companions = ['Sleepy Calico Cat', 'Wise Study Owl', 'Loyal Shiba Inu'];
  const companionSpots = COMPANION_SPOTS[normalizedRoom] || COMPANION_SPOTS['Study Desk'];

  return (
    <>
      {/* ========================================================================= */}
      {/* 3-POINT SOFT-SHADOW LIGHTING SETUP PER CHAMBER                            */}
      {/* ========================================================================= */}
      {isReadingNook ? (
        <>
          {/* Base Ambient / Hemisphere Light */}
          <hemisphereLight
            skyColor="#E9D5FF"
            groundColor="#2E1C12"
            intensity={0.9}
          />
          {/* Warm Amber Key Light (Window / Library Sconce) with Soft Shadows */}
          <directionalLight
            position={[-8, 12, 4]}
            intensity={1.85}
            color="#FFE8C2"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={0.5}
            shadow-camera-far={40}
            shadow-camera-left={-12}
            shadow-camera-right={12}
            shadow-camera-top={12}
            shadow-camera-bottom={-12}
            shadow-bias={-0.0004}
          />
          {/* Subtle Lavender Fill / Rim Light */}
          <directionalLight
            position={[8, 8, 8]}
            intensity={0.75}
            color="#DDD6FE"
          />
          {/* Warm Reading Nook Amber Lamp Glow */}
          <pointLight
            position={[1.8, 2.4, 0.8]}
            intensity={1.5}
            color="#FFB74D"
            distance={10}
          />
        </>
      ) : isGardenBalcony ? (
        <>
          {/* Sun-Drenched Sky / Ground Hemisphere Light */}
          <hemisphereLight
            skyColor="#BAE6FD"
            groundColor="#78350F"
            intensity={1.1}
          />
          {/* Brilliant Mediterranean Morning Key Light with Soft Shadows */}
          <directionalLight
            position={[-8, 16, 6]}
            intensity={2.3}
            color="#FEF08A"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={0.5}
            shadow-camera-far={42}
            shadow-camera-left={-12}
            shadow-camera-right={12}
            shadow-camera-top={12}
            shadow-camera-bottom={-12}
            shadow-bias={-0.0004}
          />
          {/* Azure Sky Bounce Fill Light */}
          <directionalLight
            position={[9, 9, 8]}
            intensity={0.85}
            color="#93C5FD"
          />
          {/* Warm Marble Terrace Bounce Light */}
          <pointLight
            position={[0.5, 3.5, 0.4]}
            intensity={0.8}
            color="#FED7AA"
            distance={12}
          />
        </>
      ) : (
        <>
          {/* Classical Study Desk Daylight Hemisphere Light */}
          <hemisphereLight
            skyColor="#FFFBEB"
            groundColor="#D4C5B9"
            intensity={0.95}
          />
          {/* Warm Window Sunlight Key Light with Soft Shadows */}
          <directionalLight
            position={[-10, 15, 5]}
            intensity={2.0}
            color="#FFF7ED"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={0.5}
            shadow-camera-far={42}
            shadow-camera-left={-12}
            shadow-camera-right={12}
            shadow-camera-top={12}
            shadow-camera-bottom={-12}
            shadow-bias={-0.0004}
          />
          {/* Soft Slate Sky Rim / Fill Light */}
          <directionalLight
            position={[8, 10, 8]}
            intensity={0.7}
            color="#E2E8F0"
          />
          {/* Study Lamp Ambient Warm Glow */}
          <pointLight
            position={[0, 4.0, -0.6]}
            intensity={0.9}
            color="#FED7AA"
            distance={10}
          />
        </>
      )}

      {/* ========================================================================= */}
      {/* BASE ARCHITECTURAL FOUNDATION GEOMETRY PER CHAMBER                        */}
      {/* ========================================================================= */}
      {isReadingNook ? (
        <ReadingNookBase />
      ) : isGardenBalcony ? (
        <GardenBalconyBase />
      ) : (
        <RoomBase />
      )}

      {/* ========================================================================= */}
      {/* DESIGNATED ANCHOR ZONE DECOR PLACEMENTS (NO CLIPPING)                     */}
      {/* ========================================================================= */}
      {Array.from(itemPlacements.entries()).map(([itemName, zoneData]) => {
        const ModelComponent = DECOR_MODELS_MAP[itemName];
        if (!ModelComponent) return null;

        return (
          <AnimatedSpawnItem
            key={itemName}
            isEquipped={true}
            position={zoneData.position}
            rotation={zoneData.rotation}
            scaleMultiplier={zoneData.scale ? zoneData.scale[0] : 1}
          >
            <ModelComponent />
          </AnimatedSpawnItem>
        );
      })}

      {/* ========================================================================= */}
      {/* COMPANION PETS (DEDICATED SANCTUARY ANCHOR SPOTS)                         */}
      {/* ========================================================================= */}
      {companions.map((compName) => {
        const isEquipped = equippedNames.has(compName);
        const ModelComponent = DECOR_MODELS_MAP[compName];
        const spot = companionSpots[compName] || { position: [0, 0, 0], rotation: [0, 0, 0] };
        if (!ModelComponent) return null;

        return (
          <AnimatedSpawnItem
            key={compName}
            isEquipped={isEquipped}
            position={spot.position}
            rotation={spot.rotation}
          >
            <ModelComponent />
          </AnimatedSpawnItem>
        );
      })}

      {/* ========================================================================= */}
      {/* STUDY SPIRIT COMPANION (ACTIVE STAGE 3D MODEL)                            */}
      {/* ========================================================================= */}
      {spiritModelKey && (
        <SpiritCompanion
          modelKey={spiritModelKey}
          roomName={roomName}
          onGreet={onGreet}
        />
      )}
    </>
  );
}

export default RoomScene;
