import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  RoomBase,
  ReadingNookBase,
  GardenBalconyBase,
  DECOR_MODELS_MAP
} from './RoomModels.jsx';
import { SpiritCompanion } from './SpiritModels.jsx';
import { AnimatedSpawnItem } from './AnimatedSpawnItem.jsx';
import { COMPANION_SPOTS } from './companionSpots.js';
import {
  validatePlacement,
  getDefaultPlacement,
  normalizeChamberName,
  getSurfacesForRoom,
  getSurfaceAt
} from './placementBounds.js';

/**
 * Helper to raycast against all elevated room surfaces and the floor plane.
 * Returns the highest elevation surface that the ray intersects inside its bounding box,
 * or the floor plane if no elevated surface is intersected.
 */
function raycastAllSurfaces(ray, roomName, existingItems = [], ignoreItemId = null) {
  const surfaces = getSurfacesForRoom(roomName, existingItems, ignoreItemId);
  const intersectionPoint = new THREE.Vector3();
  let bestHit = null;

  // 1. Check each elevated surface plane
  for (const surf of surfaces) {
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -surf.height);
    if (ray.intersectPlane(plane, intersectionPoint)) {
      if (
        intersectionPoint.x >= surf.minX &&
        intersectionPoint.x <= surf.maxX &&
        intersectionPoint.z >= surf.minZ &&
        intersectionPoint.z <= surf.maxZ
      ) {
        const dist = ray.origin.distanceTo(intersectionPoint);
        if (!bestHit || dist < bestHit.distance) {
          bestHit = {
            point: intersectionPoint.clone(),
            surface: surf,
            distance: dist
          };
        }
      }
    }
  }

  if (bestHit) return bestHit;

  // 2. Fallback to floor plane (y = 0)
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  if (ray.intersectPlane(floorPlane, intersectionPoint)) {
    return {
      point: intersectionPoint.clone(),
      surface: {
        id: 'floor',
        label: 'Floor',
        height: 0,
        maxItemSize: 'all',
        isSurface: false
      },
      distance: ray.origin.distanceTo(intersectionPoint)
    };
  }

  return null;
}

/**
 * RejectionPulse
 * Animated expanding red ring that triggers at invalid placement or drop spots.
 */
function RejectionPulse({ x, y = 0, z, onDone }) {
  const meshRef = useRef();
  const startTime = useRef(Date.now());
  const [scale, setScale] = useState(0.4);
  const [opacity, setOpacity] = useState(0.9);

  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    if (elapsed > 0.45) {
      onDone?.();
      return;
    }
    setScale(0.4 + elapsed * 2.8);
    setOpacity(Math.max(0, 0.9 - elapsed * 2.0));
  });

  return (
    <group position={[x, (y || 0) + 0.05, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
        <ringGeometry args={[0.55, 0.85, 32]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={opacity} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={scale * 0.85}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={opacity * 0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * DraggablePlacedItem
 * Interactive placed decor item with smooth floor/surface drag-to-reposition,
 * automatic OrbitControls suspension during drag, height snapping, and collision snapback.
 */
function DraggablePlacedItem({
  item,
  roomName,
  allEquippedItems,
  onUpdateItemPosition,
  onSetControlsEnabled,
  onShowRejection,
  isPlacingActive
}) {
  const { camera, raycaster, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Compute safe initial / persisted position with surface-aware elevation
  const initialCoord = useMemo(() => {
    if (
      item.position_x !== null && item.position_x !== undefined &&
      item.position_z !== null && item.position_z !== undefined
    ) {
      const x = Number(item.position_x);
      const z = Number(item.position_z);
      const y = item.position_y !== null && item.position_y !== undefined
        ? Number(item.position_y)
        : (getSurfaceAt(roomName, x, z, allEquippedItems, item.id).height || 0);
      return [x, y, z];
    }
    const def = getDefaultPlacement(roomName, allEquippedItems, item.id);
    return [def.x, def.y || 0, def.z];
  }, [item.id, item.position_x, item.position_y, item.position_z, roomName, allEquippedItems]);

  const [currentPos, setCurrentPos] = useState(initialCoord);
  const originalPosRef = useRef(initialCoord);

  // Sync state if coordinates change externally
  useEffect(() => {
    if (!isDragging) {
      if (item.position_x !== null && item.position_x !== undefined) {
        const x = Number(item.position_x);
        const z = Number(item.position_z);
        const y = item.position_y !== null && item.position_y !== undefined
          ? Number(item.position_y)
          : (getSurfaceAt(roomName, x, z, allEquippedItems, item.id).height || 0);
        const next = [x, y, z];
        setCurrentPos(next);
        originalPosRef.current = next;
      }
    }
  }, [item.position_x, item.position_y, item.position_z, roomName, allEquippedItems, isDragging]);

  const ModelComponent = DECOR_MODELS_MAP[item.item?.name];
  if (!ModelComponent) return null;

  const handlePointerDown = (e) => {
    if (isPlacingActive) return;
    if (e.button !== 0) return; // Left-click only
    e.stopPropagation();

    setIsDragging(true);
    originalPosRef.current = [...currentPos];
    onSetControlsEnabled?.(false);

    // Track global window pointer movements for fluid drag across surfaces and floor
    const handleWindowPointerMove = (moveEvt) => {
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((moveEvt.clientX - rect.left) / rect.width) * 2 - 1,
        -((moveEvt.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const hit = raycastAllSurfaces(raycaster.ray, roomName, allEquippedItems, item.id);
      if (hit) {
        setCurrentPos([hit.point.x, hit.surface.height, hit.point.z]);
      }
    };

    const handleWindowPointerUp = (upEvt) => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);

      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((upEvt.clientX - rect.left) / rect.width) * 2 - 1,
        -((upEvt.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);

      let finalX = originalPosRef.current[0];
      let finalY = originalPosRef.current[1];
      let finalZ = originalPosRef.current[2];
      let targetSurface = item.surface || 'floor';

      const hit = raycastAllSurfaces(raycaster.ray, roomName, allEquippedItems, item.id);
      if (hit) {
        finalX = hit.point.x;
        finalY = hit.surface.height;
        finalZ = hit.point.z;
        targetSurface = hit.surface.id;
      }

      setIsDragging(false);
      onSetControlsEnabled?.(true);

      const validation = validatePlacement(
        roomName,
        finalX,
        finalZ,
        allEquippedItems,
        item.id,
        item.item?.name
      );

      if (validation.valid) {
        setCurrentPos([finalX, finalY, finalZ]);
        originalPosRef.current = [finalX, finalY, finalZ];
        onUpdateItemPosition?.(item.id, {
          position_x: finalX,
          position_y: finalY,
          position_z: finalZ,
          rotation_y: item.rotation_y || 0,
          surface: targetSurface
        });
      } else {
        // Snap back to previous position and trigger red ripple at failed drop point
        setCurrentPos(originalPosRef.current);
        onShowRejection?.(finalX, finalZ, validation.message, finalY);
      }
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
  };

  return (
    <group
      position={currentPos}
      rotation={[0, item.rotation_y || 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerOver={(e) => {
        if (!isPlacingActive) {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'grab';
        }
      }}
      onPointerOut={() => {
        setIsHovered(false);
        if (!isDragging) document.body.style.cursor = 'auto';
      }}
    >
      {/* Visual selection & interaction ring */}
      {(isHovered || isDragging) && (
        <group position={[0, 0.02, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.7, 0.9, 32]} />
            <meshBasicMaterial
              color={isDragging ? '#F59E0B' : '#10B981'}
              transparent
              opacity={isDragging ? 0.85 : 0.55}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
            <circleGeometry args={[0.7, 32]} />
            <meshBasicMaterial
              color={isDragging ? '#F59E0B' : '#10B981'}
              transparent
              opacity={0.15}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      <ModelComponent />
    </group>
  );
}

/**
 * RoomScene
 * Manages lighting, chamber foundation geometry, free user-controlled decor placement,
 * surface-aware stacking, drag-to-reposition, and interactive spirit/companion models.
 */
export function RoomScene({
  equippedItems = [],
  roomName = 'Study Desk',
  spiritModelKey = null,
  onGreet = null,
  placingItem = null,
  onConfirmPlacement = null,
  onCancelPlacement = null,
  onUpdateItemPosition = null,
  onSetControlsEnabled = null,
  onRejectionNotice = null
}) {
  const { camera, raycaster, gl } = useThree();
  const isReadingNook = roomName.includes('Reading') || roomName.includes('Nook');
  const isGardenBalcony = roomName.includes('Garden') || roomName.includes('Balcony');
  const normalizedRoom = isReadingNook ? 'Reading Nook' : isGardenBalcony ? 'Garden Balcony' : 'Study Desk';

  // Active chamber surfaces (including dynamically placed bookshelves)
  const chamberSurfaces = useMemo(() => {
    return getSurfacesForRoom(normalizedRoom, equippedItems);
  }, [normalizedRoom, equippedItems]);

  // Floor/surface raycasting & ghost preview state
  const [previewPos, setPreviewPos] = useState(null);
  const [previewValid, setPreviewValid] = useState(true);
  const [rejections, setRejections] = useState([]);

  const showRejection = useCallback((x, z, message, y = 0) => {
    setRejections((prev) => [...prev, { x, y, z, id: Date.now() + Math.random() }]);
    onRejectionNotice?.(message);
  }, [onRejectionNotice]);

  const removeRejection = useCallback((id) => {
    setRejections((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Surface/floor pointer move during placement mode
  const handleFloorPointerMove = useCallback((e) => {
    if (!placingItem) return;
    e.stopPropagation();

    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);

    const hit = raycastAllSurfaces(raycaster.ray, normalizedRoom, equippedItems, null);
    if (!hit) return;

    const validation = validatePlacement(
      normalizedRoom,
      hit.point.x,
      hit.point.z,
      equippedItems,
      null,
      placingItem.item?.name
    );

    setPreviewPos({
      x: hit.point.x,
      y: hit.surface.height,
      z: hit.point.z,
      surface: hit.surface.id
    });
    setPreviewValid(validation.valid);
  }, [placingItem, gl, raycaster, camera, normalizedRoom, equippedItems]);

  // Click to place on surface or floor
  const handleFloorPointerDown = useCallback((e) => {
    if (!placingItem) return;
    if (e.button !== 0) return; // Left click only
    e.stopPropagation();

    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);

    const hit = raycastAllSurfaces(raycaster.ray, normalizedRoom, equippedItems, null);
    if (!hit) return;

    const validation = validatePlacement(
      normalizedRoom,
      hit.point.x,
      hit.point.z,
      equippedItems,
      null,
      placingItem.item?.name
    );

    if (validation.valid) {
      onConfirmPlacement?.(hit.point.x, hit.point.z, hit.surface.height, hit.surface.id);
      setPreviewPos(null);
    } else {
      showRejection(hit.point.x, hit.point.z, validation.message, hit.surface.height);
    }
  }, [placingItem, gl, raycaster, camera, normalizedRoom, equippedItems, onConfirmPlacement, showRejection]);

  // Filter out decor items vs companions
  const decorItems = useMemo(() => {
    return equippedItems.filter(
      (inv) => inv.item?.category !== 'companion' && inv.item?.category !== 'badge'
    );
  }, [equippedItems]);

  const equippedNames = useMemo(() => {
    return new Set(equippedItems.map((inv) => inv.item?.name));
  }, [equippedItems]);

  // Companions and dedicated anchor spots
  const companions = ['Sleepy Calico Cat', 'Wise Study Owl', 'Loyal Shiba Inu'];
  const companionSpots = COMPANION_SPOTS[normalizedRoom] || COMPANION_SPOTS['Study Desk'];

  // Ghost model component for placement preview
  const GhostModelComponent = placingItem ? DECOR_MODELS_MAP[placingItem.item?.name] : null;

  return (
    <>
      {/* ========================================================================= */}
      {/* 3-POINT SOFT-SHADOW LIGHTING SETUP PER CHAMBER                            */}
      {/* ========================================================================= */}
      {isReadingNook ? (
        <>
          <hemisphereLight skyColor="#E9D5FF" groundColor="#2E1C12" intensity={0.9} />
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
          <directionalLight position={[8, 8, 8]} intensity={0.75} color="#DDD6FE" />
          <pointLight position={[1.8, 2.4, 0.8]} intensity={1.5} color="#FFB74D" distance={10} />
        </>
      ) : isGardenBalcony ? (
        <>
          <hemisphereLight skyColor="#BAE6FD" groundColor="#78350F" intensity={1.1} />
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
          <directionalLight position={[9, 9, 8]} intensity={0.85} color="#93C5FD" />
          <pointLight position={[0.5, 3.5, 0.4]} intensity={0.8} color="#FED7AA" distance={12} />
        </>
      ) : (
        <>
          <hemisphereLight skyColor="#FFFBEB" groundColor="#D4C5B9" intensity={0.95} />
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
          <directionalLight position={[8, 10, 8]} intensity={0.7} color="#E2E8F0" />
          <pointLight position={[0, 4.0, -0.6]} intensity={0.9} color="#FED7AA" distance={10} />
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
      {/* INVISIBLE RAYCASTING RECEIVERS (FOR FREE PLACEMENT & SURFACE STACKING)    */}
      {/* ========================================================================= */}
      {/* Base Floor Receiver */}
      <mesh
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handleFloorPointerMove}
        onPointerDown={handleFloorPointerDown}
      >
        <planeGeometry args={[22, 22]} />
        <meshBasicMaterial transparent opacity={0.0001} depthWrite={false} />
      </mesh>

      {/* Surface-specific elevated receivers */}
      {chamberSurfaces.map((surf) => (
        <mesh
          key={surf.id}
          position={[
            (surf.minX + surf.maxX) / 2,
            surf.height + 0.005,
            (surf.minZ + surf.maxZ) / 2
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={handleFloorPointerMove}
          onPointerDown={handleFloorPointerDown}
        >
          <planeGeometry
            args={[
              Math.max(0.1, surf.maxX - surf.minX),
              Math.max(0.1, surf.maxZ - surf.minZ)
            ]}
          />
          <meshBasicMaterial transparent opacity={0.0001} depthWrite={false} />
        </mesh>
      ))}

      {/* ========================================================================= */}
      {/* PLACED DECOR ITEMS (INTERACTIVE & DRAGGABLE)                              */}
      {/* ========================================================================= */}
      {decorItems.map((inv) => (
        <DraggablePlacedItem
          key={inv.id}
          item={inv}
          roomName={normalizedRoom}
          allEquippedItems={equippedItems}
          onUpdateItemPosition={onUpdateItemPosition}
          onSetControlsEnabled={onSetControlsEnabled}
          onShowRejection={showRejection}
          isPlacingActive={Boolean(placingItem)}
        />
      ))}

      {/* ========================================================================= */}
      {/* PLACEMENT GHOST PREVIEW (WHEN PLACING ITEM)                               */}
      {/* ========================================================================= */}
      {placingItem && previewPos && (
        <group position={[previewPos.x, (previewPos.y || 0) + 0.02, previewPos.z]}>
          {/* Target Ring Indicator */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.55, 0.8, 32]} />
            <meshBasicMaterial
              color={previewValid ? '#10B981' : '#EF4444'}
              transparent
              opacity={0.85}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
            <circleGeometry args={[0.55, 32]} />
            <meshBasicMaterial
              color={previewValid ? '#10B981' : '#EF4444'}
              transparent
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>

          {/* Invalid Crosshair Marker */}
          {!previewValid && (
            <group position={[0, 0.35, 0]}>
              <mesh rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.06, 0.36, 0.06]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
              <mesh rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.06, 0.36, 0.06]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
            </group>
          )}

          {/* Ghost Item Model */}
          {GhostModelComponent && (
            <group>
              <GhostModelComponent />
            </group>
          )}
        </group>
      )}

      {/* ========================================================================= */}
      {/* RED REJECTION RIPPLES (FEEDBACK ON INVALID CLICK/DROP)                    */}
      {/* ========================================================================= */}
      {rejections.map((rej) => (
        <RejectionPulse
          key={rej.id}
          x={rej.x}
          y={rej.y}
          z={rej.z}
          onDone={() => removeRejection(rej.id)}
        />
      ))}

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
