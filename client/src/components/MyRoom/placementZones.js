/**
 * placementZones.js
 * Designated placement zones for Life RPG 3D Sanctuary rooms.
 * Replaces ad-hoc free-placement with 6 distinct non-overlapping anchor points per chamber.
 * Prevents geometric clipping through walls, desk, or other furniture.
 */

export const ROOM_ZONES = {
  'Study Desk': [
    {
      id: 'zone_desk_surface',
      label: 'Desk Surface',
      position: [0.75, 1.42, -0.65],
      rotation: [0, -0.2, 0],
      scale: [1, 1, 1],
      description: 'Generous oak desk surface bathed in warm morning light.'
    },
    {
      id: 'zone_window_sill',
      label: 'Window Sill',
      position: [-7.0, 2.52, -1.2],
      rotation: [0, Math.PI / 2, 0],
      scale: [1, 1, 1],
      description: 'Wide sunny windowsill overlooking fluffy pixel clouds.'
    },
    {
      id: 'zone_floor_left',
      label: 'Floor Left',
      position: [-3.8, 0.02, 1.8],
      rotation: [0, 0.25, 0],
      scale: [1, 1, 1],
      description: 'Cozy floor area beside the study rug and window.'
    },
    {
      id: 'zone_floor_right',
      label: 'Floor Right',
      position: [3.8, 0.02, 1.6],
      rotation: [0, -0.35, 0],
      scale: [1, 1, 1],
      description: 'Spacious study lounge corner beside the bookshelves.'
    },
    {
      id: 'zone_wall_shelf',
      label: 'Wall Shelf',
      position: [2.4, 4.1, -7.2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      description: 'Sturdy wall alcove mounted against the sage plaster.'
    },
    {
      id: 'zone_corner',
      label: 'Study Corner',
      position: [-5.0, 0.02, -5.0],
      rotation: [0, Math.PI / 4, 0],
      scale: [1, 1, 1],
      description: 'Quiet sheltered corner framed by classical wood trim.'
    }
  ],

  'Reading Nook': [
    {
      id: 'zone_desk_surface',
      label: 'Reading Side Table',
      position: [1.8, 1.15, 0.75],
      rotation: [0, -0.1, 0],
      scale: [1, 1, 1],
      description: 'Mahogany pedestal side table next to the velvet armchair.'
    },
    {
      id: 'zone_window_sill',
      label: 'Twilight Window Sill',
      position: [-7.0, 2.45, 0.6],
      rotation: [0, Math.PI / 2, 0],
      scale: [1, 1, 1],
      description: 'Romantic bay windowsill looking onto stars and crescent moon.'
    },
    {
      id: 'zone_floor_left',
      label: 'Armchair Hearth',
      position: [-3.8, 0.02, 2.2],
      rotation: [0, 0.3, 0],
      scale: [1, 1, 1],
      description: 'Soft emerald velvet rug area near the reading chair.'
    },
    {
      id: 'zone_floor_right',
      label: 'Floor Lounge',
      position: [4.2, 0.02, 1.8],
      rotation: [0, -0.4, 0],
      scale: [1, 1, 1],
      description: 'Walnut herringbone lounge space beside the grand book stacks.'
    },
    {
      id: 'zone_wall_shelf',
      label: 'Library Alcove Shelf',
      position: [3.8, 3.8, -7.1],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      description: 'Built-in library shelf nestled inside the mahogany cabinetry.'
    },
    {
      id: 'zone_corner',
      label: 'Nook Corner Arch',
      position: [-5.2, 0.02, -5.0],
      rotation: [0, Math.PI / 4, 0],
      scale: [1, 1, 1],
      description: 'Gilded corner arch framed by deep forest green walls.'
    }
  ],

  'Garden Balcony': [
    {
      id: 'zone_desk_surface',
      label: 'Bistro Table',
      position: [0.5, 1.34, 0.4],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      description: 'Wrought-iron bistro table with polished white marble top.'
    },
    {
      id: 'zone_window_sill',
      label: 'Stone Planter Ledge',
      position: [-3.8, 0.95, -6.0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      description: 'Carved limestone planter ledge along the balustrade.'
    },
    {
      id: 'zone_floor_left',
      label: 'Terrace Pavers Left',
      position: [-4.2, 0.02, 2.0],
      rotation: [0, 0.3, 0],
      scale: [1, 1, 1],
      description: 'Terracotta paver corner shaded by climbing wisteria.'
    },
    {
      id: 'zone_floor_right',
      label: 'Sunlit Overlook',
      position: [4.0, 0.02, 1.8],
      rotation: [0, -0.4, 0],
      scale: [1, 1, 1],
      description: 'Warm sunlit terrace corner overlooking rolling hills.'
    },
    {
      id: 'zone_wall_shelf',
      label: 'Sandstone Wall Alcove',
      position: [-7.1, 3.4, -1.8],
      rotation: [0, Math.PI / 2, 0],
      scale: [1, 1, 1],
      description: 'Rustic sandstone wall alcove wrapped in ivy vines.'
    },
    {
      id: 'zone_corner',
      label: 'Balcony Trellis Corner',
      position: [-5.0, 0.02, -4.8],
      rotation: [0, Math.PI / 4, 0],
      scale: [1, 1, 1],
      description: 'Open corner framed by flowering blossoms and stone pillars.'
    }
  ]
};

// Priority preference of zones per item
export const ITEM_ZONE_PREFERENCES = {
  'Warm Desk Lamp': ['zone_desk_surface', 'zone_floor_right', 'zone_window_sill'],
  'Ceremonial Matcha Bowl': ['zone_desk_surface', 'zone_window_sill', 'zone_wall_shelf'],
  'Lo-Fi Cassette Player': ['zone_desk_surface', 'zone_wall_shelf', 'zone_floor_left'],
  'Potted Succulent': ['zone_window_sill', 'zone_desk_surface', 'zone_wall_shelf', 'zone_floor_left'],
  'Zen Bonsai Tree': ['zone_corner', 'zone_floor_left', 'zone_window_sill', 'zone_desk_surface'],
  'Oak Bookshelf': ['zone_wall_shelf', 'zone_corner', 'zone_floor_right'],
  'Grandfather Clock': ['zone_corner', 'zone_floor_right'],
  'Velvet Reading Armchair': ['zone_floor_right', 'zone_floor_left', 'zone_corner'],
  'Vintage Brass Astrolabe': ['zone_desk_surface', 'zone_wall_shelf', 'zone_window_sill'],
  'Monstera Deliciosa': ['zone_floor_left', 'zone_corner', 'zone_window_sill'],
  'Starlight Candle Trio': ['zone_desk_surface', 'zone_window_sill', 'zone_wall_shelf'],
  'Cozy Floor Pouf': ['zone_floor_left', 'zone_floor_right'],
  'Antique Gramophone': ['zone_floor_right', 'zone_desk_surface', 'zone_corner'],
  'Terracotta Herb Planter': ['zone_window_sill', 'zone_floor_left', 'zone_desk_surface'],
  'Woven Persian Rug': ['zone_floor_left', 'zone_floor_right']
};

// Dedicated companion spots per room so companions never block decor zones
export const COMPANION_SPOTS = {
  'Study Desk': {
    'Sleepy Calico Cat': { position: [-1.4, 0.03, 1.4], rotation: [0, 0.4, 0] },
    'Wise Study Owl': { position: [-2.6, 3.2, -2.8], rotation: [0, 0.6, 0] },
    'Loyal Shiba Inu': { position: [1.8, 0.02, 0.9], rotation: [0, -0.45, 0] }
  },
  'Reading Nook': {
    'Sleepy Calico Cat': { position: [-0.4, 0.03, 1.8], rotation: [0, 0.2, 0] },
    'Wise Study Owl': { position: [-2.8, 3.4, -3.2], rotation: [0, 0.5, 0] },
    'Loyal Shiba Inu': { position: [2.2, 0.02, 1.2], rotation: [0, -0.5, 0] }
  },
  'Garden Balcony': {
    'Sleepy Calico Cat': { position: [-1.2, 0.03, 1.2], rotation: [0, 0.35, 0] },
    'Wise Study Owl': { position: [-3.2, 3.2, -3.0], rotation: [0, 0.7, 0] },
    'Loyal Shiba Inu': { position: [2.0, 0.02, 0.8], rotation: [0, -0.4, 0] }
  }
};

/**
 * resolveRoomPlacements
 * Takes currently equipped decor item names and room name,
 * deterministically assigns each decor item to an available compatible zone,
 * and returns zone coordinates for rendering + live zone occupancy status for UI.
 */
export function resolveRoomPlacements(equippedNames = new Set(), roomName = 'Study Desk') {
  const normalizedRoom = roomName.includes('Reading') || roomName.includes('Nook')
    ? 'Reading Nook'
    : roomName.includes('Garden') || roomName.includes('Balcony')
    ? 'Garden Balcony'
    : 'Study Desk';

  const roomZones = ROOM_ZONES[normalizedRoom] || ROOM_ZONES['Study Desk'];
  const occupiedZones = new Map(); // zoneId -> itemName
  const itemPlacements = new Map(); // itemName -> zone data

  // All equipped items that are decor
  const decorItems = Array.from(equippedNames).filter(
    (name) => ITEM_ZONE_PREFERENCES[name] !== undefined
  );

  for (const itemName of decorItems) {
    const preferences = ITEM_ZONE_PREFERENCES[itemName] || roomZones.map((z) => z.id);
    let assignedZone = null;

    // First try preferred zones
    for (const zoneId of preferences) {
      if (!occupiedZones.has(zoneId)) {
        assignedZone = roomZones.find((z) => z.id === zoneId);
        if (assignedZone) break;
      }
    }

    // Fallback: any unoccupied zone
    if (!assignedZone) {
      assignedZone = roomZones.find((z) => !occupiedZones.has(z.id));
    }

    if (assignedZone) {
      occupiedZones.set(assignedZone.id, itemName);
      itemPlacements.set(itemName, {
        ...assignedZone,
        itemName
      });
    }
  }

  // Zone status summary for UI
  const zoneOccupancy = roomZones.map((zone) => {
    const occupiedBy = occupiedZones.get(zone.id) || null;
    return {
      zoneId: zone.id,
      label: zone.label,
      description: zone.description,
      isOccupied: Boolean(occupiedBy),
      occupiedBy
    };
  });

  return {
    itemPlacements,
    zoneOccupancy,
    totalZones: roomZones.length,
    occupiedCount: occupiedZones.size,
    isFull: occupiedZones.size >= roomZones.length
  };
}

/**
 * getPlacementHintForItem
 * Returns where an item will be placed in the specified room, or which zone it occupies.
 */
export function getPlacementHintForItem(itemName, equippedNames = new Set(), roomName = 'Study Desk') {
  const companionSpots = COMPANION_SPOTS[roomName] || COMPANION_SPOTS['Study Desk'];
  if (companionSpots && companionSpots[itemName]) {
    return 'Dedicated Companion Perch / Rug';
  }

  const { itemPlacements, zoneOccupancy } = resolveRoomPlacements(equippedNames, roomName);
  if (itemPlacements.has(itemName)) {
    const placement = itemPlacements.get(itemName);
    return `${placement.label} (Placed)`;
  }

  // Find where it would go if equipped
  const hypotheticalEquipped = new Set(equippedNames);
  hypotheticalEquipped.add(itemName);
  const hypothetical = resolveRoomPlacements(hypotheticalEquipped, roomName);

  if (hypothetical.itemPlacements.has(itemName)) {
    const nextZone = hypothetical.itemPlacements.get(itemName);
    return `Snaps to: ${nextZone.label}`;
  }

  return 'Chamber Zones Full (Recall another item first)';
}
