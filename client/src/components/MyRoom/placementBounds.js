/**
 * placementBounds.js
 * Collision geometry and validation rules for free user-controlled 3D placement.
 * Ensures items cannot be placed outside floor bounds, clipping into fixed chamber furniture,
 * or colliding with other placed decor items.
 */

export const ROOM_BOUNDS = {
  minX: -6.4,
  maxX: 6.4,
  minZ: -6.4,
  maxZ: 6.4
};

// Fixed furniture footprints per chamber (Axis-Aligned Bounding Boxes [minX, maxX, minZ, maxZ])
export const CHAMBER_OBSTACLES = {
  'Study Desk': [
    // Executive Study Desk (blocked on floor level)
    { id: 'desk', minX: -2.6, maxX: 2.6, minZ: -1.9, maxZ: 0.7, label: 'Study Desk' },
    // Back wall & left window margin
    { id: 'back_wall', minX: -7.0, maxX: 7.0, minZ: -7.5, maxZ: -6.5, label: 'Back Wall' },
    { id: 'left_wall', minX: -7.5, maxX: -6.5, minZ: -7.0, maxZ: 7.0, label: 'Window Wall' }
  ],
  'Reading Nook': [
    // Grand Built-in Bookshelves
    { id: 'bookshelf', minX: -6.2, maxX: 3.8, minZ: -7.6, maxZ: -6.5, label: 'Grand Bookshelf' },
    // Velvet Reading Armchair
    { id: 'armchair', minX: -2.2, maxX: -0.2, minZ: 0.2, maxZ: 2.2, label: 'Reading Armchair' },
    // Round Pedestal Tea Side Table
    { id: 'tea_table', minX: 0.9, maxX: 2.7, minZ: -0.1, maxZ: 1.7, label: 'Tea Table' },
    // Left Bay Window
    { id: 'bay_window', minX: -7.5, maxX: -6.5, minZ: -2.0, maxZ: 3.0, label: 'Bay Window' }
  ],
  'Garden Balcony': [
    // Classical Stone Balustrade
    { id: 'balustrade', minX: -7.5, maxX: 7.5, minZ: -7.5, maxZ: -6.2, label: 'Stone Balustrade' },
    // Wrought-Iron Bistro Table & Chairs
    { id: 'bistro_table', minX: -0.9, maxX: 1.9, minZ: -0.9, maxZ: 1.7, label: 'Bistro Table' },
    // Ivy Wall Plinth
    { id: 'ivy_wall', minX: -7.5, maxX: -6.5, minZ: -7.0, maxZ: 7.0, label: 'Sandstone Wall' }
  ]
};

/**
 * Surface Metadata
 * Placeable elevated furniture surfaces with exact bounding areas and top face heights.
 */
export const CHAMBER_SURFACES = {
  'Study Desk': [
    {
      id: 'study_desk',
      obstacleId: 'desk',
      label: 'Study Desk',
      height: 1.44,
      minX: -2.35,
      maxX: 2.35,
      minZ: -1.65,
      maxZ: 0.45,
      maxItemSize: 'small'
    },
    {
      id: 'window_sill',
      obstacleId: 'left_wall',
      label: 'Window Sill',
      height: 2.31,
      minX: -7.55,
      maxX: -6.85,
      minZ: -3.1,
      maxZ: 0.7,
      maxItemSize: 'small'
    }
  ],
  'Reading Nook': [
    {
      id: 'tea_table',
      obstacleId: 'tea_table',
      label: 'Tea Side Table',
      height: 1.15,
      minX: 1.1,
      maxX: 2.5,
      minZ: 0.05,
      maxZ: 1.45,
      maxItemSize: 'small'
    },
    {
      id: 'bay_window_sill',
      obstacleId: 'bay_window',
      label: 'Bay Window Sill',
      height: 2.32,
      minX: -7.55,
      maxX: -6.85,
      minZ: -1.4,
      maxZ: 2.6,
      maxItemSize: 'small'
    }
  ],
  'Garden Balcony': [
    {
      id: 'bistro_table',
      obstacleId: 'bistro_table',
      label: 'Bistro Table',
      height: 1.33,
      minX: -0.4,
      maxX: 1.4,
      minZ: -0.5,
      maxZ: 1.3,
      maxItemSize: 'small'
    },
    {
      id: 'balustrade',
      obstacleId: 'balustrade',
      label: 'Stone Balustrade',
      height: 1.70,
      minX: -6.5,
      maxX: 6.5,
      minZ: -7.1,
      maxZ: -6.5,
      maxItemSize: 'small'
    }
  ]
};

/**
 * Item Size Classification
 * Small items fit onto desks, tables, window sills, and bookshelves.
 * Large items can only be placed on the room floor.
 */
export const ITEM_SIZE_CLASS = {
  // Small decor (surface-friendly)
  'Warm Desk Lamp': 'small',
  'Ceremonial Matcha Bowl': 'small',
  'Lo-Fi Cassette Player': 'small',
  'Potted Succulent': 'small',
  'Zen Bonsai Tree': 'small',
  'Vintage Brass Astrolabe': 'small',
  'Starlight Candle Trio': 'small',
  'Antique Gramophone': 'small',
  'Terracotta Herb Planter': 'small',

  // Large furniture (floor only)
  'Oak Bookshelf': 'large',
  'Grandfather Clock': 'large',
  'Velvet Reading Armchair': 'large',
  'Cozy Floor Pouf': 'large',
  'Monstera Deliciosa': 'large',
  'Woven Persian Rug': 'large'
};

export const MIN_ITEM_DISTANCE_FLOOR = 0.95; // Radius clearance on open floor
export const MIN_ITEM_DISTANCE_SURFACE = 0.55; // Compact clearance on tabletops/sills

/**
 * Normalizes chamber name to match key
 */
export function normalizeChamberName(name = '') {
  if (name.includes('Reading') || name.includes('Nook')) return 'Reading Nook';
  if (name.includes('Garden') || name.includes('Balcony')) return 'Garden Balcony';
  return 'Study Desk';
}

/**
 * Retrieves all eligible surfaces for a chamber, including dynamic placed furniture
 * (e.g. top of placed Oak Bookshelf).
 */
export function getSurfacesForRoom(roomName, existingItems = [], ignoreItemId = null) {
  const chamberKey = normalizeChamberName(roomName);
  const staticSurfaces = CHAMBER_SURFACES[chamberKey] || CHAMBER_SURFACES['Study Desk'];
  const surfaces = [...staticSurfaces];

  // Dynamically add tops of placed bookshelves
  for (const inv of existingItems) {
    if (inv.id === ignoreItemId) continue;
    if (inv.item?.name === 'Oak Bookshelf' && inv.position_x !== null && inv.position_z !== null) {
      surfaces.push({
        id: `bookshelf_${inv.id}`,
        label: 'Oak Bookshelf Top',
        height: 2.04,
        minX: Number(inv.position_x) - 0.62,
        maxX: Number(inv.position_x) + 0.62,
        minZ: Number(inv.position_z) - 0.26,
        maxZ: Number(inv.position_z) + 0.26,
        maxItemSize: 'small'
      });
    }
  }

  return surfaces;
}

/**
 * Identifies which surface (or floor) contains the given (x, z) coordinates.
 * Returns the highest elevation surface if overlapping.
 */
export function getSurfaceAt(roomName, targetX, targetZ, existingItems = [], currentItemId = null) {
  const surfaces = getSurfacesForRoom(roomName, existingItems, currentItemId);
  let bestSurface = null;

  for (const surf of surfaces) {
    if (
      targetX >= surf.minX &&
      targetX <= surf.maxX &&
      targetZ >= surf.minZ &&
      targetZ <= surf.maxZ
    ) {
      if (!bestSurface || surf.height > bestSurface.height) {
        bestSurface = { ...surf, isSurface: true };
      }
    }
  }

  if (bestSurface) return bestSurface;

  return {
    id: 'floor',
    label: 'Floor',
    height: 0,
    maxItemSize: 'all',
    isSurface: false
  };
}

/**
 * Validates whether placing an item at (targetX, targetZ) is legal.
 * Supports surface-aware placement, height elevation, and size restrictions.
 */
export function validatePlacement(
  roomName,
  targetX,
  targetZ,
  existingItems = [],
  currentItemId = null,
  itemName = null
) {
  // Determine item size class
  const resolvedName = itemName || existingItems.find((inv) => inv.id === currentItemId)?.item?.name;
  const itemSize = ITEM_SIZE_CLASS[resolvedName] || 'small';

  // 1. Check if the target position is within room boundaries
  if (
    targetX < ROOM_BOUNDS.minX ||
    targetX > ROOM_BOUNDS.maxX ||
    targetZ < ROOM_BOUNDS.minZ ||
    targetZ > ROOM_BOUNDS.maxZ
  ) {
    return {
      valid: false,
      reason: 'outside_bounds',
      message: 'Cannot place outside room boundaries.'
    };
  }

  // 2. Identify the target surface (tabletop, sill, balustrade, or floor)
  const surface = getSurfaceAt(roomName, targetX, targetZ, existingItems, currentItemId);

  // 3. If placing onto an elevated surface (Desk, Window Sill, Tea Table, etc.)
  if (surface.isSurface) {
    // Size check: Large furniture cannot be placed on small surfaces
    if (itemSize === 'large') {
      return {
        valid: false,
        reason: 'surface_too_small',
        surfaceId: surface.id,
        message: `${resolvedName || 'This item'} is too large for the ${surface.label}. Place it on the floor.`
      };
    }

    // Check collision with other items on the same surface
    for (const item of existingItems) {
      if (item.id === currentItemId) continue;
      if (item.item?.category === 'companion' || item.item?.category === 'badge') continue;
      if (item.position_x === null || item.position_x === undefined) continue;
      if (item.position_z === null || item.position_z === undefined) continue;

      // Only check collision against items residing on this same surface level
      const otherSurface = getSurfaceAt(roomName, item.position_x, item.position_z, existingItems, item.id);
      if (otherSurface.id === surface.id) {
        const dx = targetX - item.position_x;
        const dz = targetZ - item.position_z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < MIN_ITEM_DISTANCE_SURFACE) {
          return {
            valid: false,
            reason: 'item_collision',
            obstacle: item.item?.name || 'decor item',
            message: `Too close to ${item.item?.name || 'another item'} on the ${surface.label}.`
          };
        }
      }
    }

    // Successfully validated on elevated surface
    return {
      valid: true,
      surface
    };
  }

  // 4. If placing on the Floor:
  const chamberKey = normalizeChamberName(roomName);
  const obstacles = CHAMBER_OBSTACLES[chamberKey] || CHAMBER_OBSTACLES['Study Desk'];

  // Check collision with fixed room obstacles (walls, fixed furniture bases)
  for (const obs of obstacles) {
    if (
      targetX >= obs.minX &&
      targetX <= obs.maxX &&
      targetZ >= obs.minZ &&
      targetZ <= obs.maxZ
    ) {
      return {
        valid: false,
        reason: 'obstacle_collision',
        obstacle: obs.label,
        message: `Too close to the ${obs.label}. Choose an open floor space.`
      };
    }
  }

  // Check collision with other floor items
  for (const item of existingItems) {
    if (item.id === currentItemId) continue;
    if (item.item?.category === 'companion' || item.item?.category === 'badge') continue;
    if (item.position_x === null || item.position_x === undefined) continue;
    if (item.position_z === null || item.position_z === undefined) continue;

    // Skip items that are elevated on furniture surfaces
    const otherSurface = getSurfaceAt(roomName, item.position_x, item.position_z, existingItems, item.id);
    if (otherSurface.isSurface) continue;

    const dx = targetX - item.position_x;
    const dz = targetZ - item.position_z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < MIN_ITEM_DISTANCE_FLOOR) {
      return {
        valid: false,
        reason: 'item_collision',
        obstacle: item.item?.name || 'decor item',
        message: `Too close to ${item.item?.name || 'another item'}.`
      };
    }
  }

  return {
    valid: true,
    surface
  };
}

/**
 * Returns a sensible default placement position if an item has no recorded coordinates.
 */
export function getDefaultPlacement(roomName, existingItems = [], currentItemId = null, itemName = null) {
  const chamberKey = normalizeChamberName(roomName);
  const candidateSpots = [
    { x: -3.8, z: -3.5 },
    { x: 3.8, z: -3.5 },
    { x: -3.8, z: 2.8 },
    { x: 3.8, z: 2.8 },
    { x: -4.5, z: 0.0 },
    { x: 4.5, z: 0.0 },
    { x: 0.0, z: 4.0 },
    { x: -2.0, z: 4.2 },
    { x: 2.0, z: 4.2 },
    { x: -4.8, z: 4.2 },
    { x: 4.8, z: 4.2 }
  ];

  for (const spot of candidateSpots) {
    const result = validatePlacement(chamberKey, spot.x, spot.z, existingItems, currentItemId, itemName);
    if (result.valid) {
      return { x: spot.x, y: result.surface?.height || 0, z: spot.z, rotationY: 0, surface: result.surface?.id || 'floor' };
    }
  }

  return { x: 3.5, y: 0, z: 3.5, rotationY: 0, surface: 'floor' };
}
