import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store persistent data in server/data/item_positions.json
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'item_positions.json');

// In-memory cache loaded from and synced to DATA_FILE
const memoryCache = new Map();

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('[PositionStore] Error creating data directory:', err.message);
  }
}

function loadFromFile() {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      if (raw.trim()) {
        const parsed = JSON.parse(raw);
        for (const [id, coords] of Object.entries(parsed)) {
          if (coords && typeof coords === 'object') {
            memoryCache.set(id, coords);
          }
        }
        console.log(`[PositionStore] Loaded ${memoryCache.size} persistent item positions from disk.`);
      }
    }
  } catch (err) {
    console.warn('[PositionStore] Warning reading persistent coordinates file:', err.message);
  }
}

function saveToFile() {
  try {
    ensureDataDir();
    const obj = {};
    for (const [id, coords] of memoryCache.entries()) {
      obj[id] = coords;
    }
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(obj, null, 2), 'utf8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    console.error('[PositionStore] Error writing persistent coordinates file:', err.message);
  }
}

// Initialize on module load
loadFromFile();

export const positionStore = {
  getPosition(inventoryId) {
    if (!inventoryId) return null;
    return memoryCache.get(inventoryId) || null;
  },

  setPosition(inventoryId, coords = {}) {
    if (!inventoryId) return;
    const posX = coords.position_x !== undefined && coords.position_x !== null ? Number(coords.position_x) : null;
    const posY = coords.position_y !== undefined && coords.position_y !== null ? Number(coords.position_y) : 0;
    const posZ = coords.position_z !== undefined && coords.position_z !== null ? Number(coords.position_z) : null;
    const rotY = coords.rotation_y !== undefined && coords.rotation_y !== null ? Number(coords.rotation_y) : 0;
    const surf = coords.surface !== undefined && coords.surface !== null ? String(coords.surface) : 'floor';

    const entry = {
      position_x: posX,
      position_y: posY,
      position_z: posZ,
      rotation_y: rotY,
      surface: surf,
      user_id: coords.user_id || null,
      updated_at: new Date().toISOString()
    };

    memoryCache.set(inventoryId, entry);
    saveToFile();
    return entry;
  },

  removePosition(inventoryId) {
    if (!inventoryId) return;
    memoryCache.delete(inventoryId);
    saveToFile();
  },

  augmentItem(inv) {
    if (!inv || typeof inv !== 'object') return inv;
    const cached = memoryCache.get(inv.id);
    return {
      ...inv,
      position_x: inv.position_x !== undefined && inv.position_x !== null 
        ? Number(inv.position_x) 
        : (cached?.position_x ?? null),
      position_y: inv.position_y !== undefined && inv.position_y !== null 
        ? Number(inv.position_y) 
        : (cached?.position_y ?? 0),
      position_z: inv.position_z !== undefined && inv.position_z !== null 
        ? Number(inv.position_z) 
        : (cached?.position_z ?? null),
      rotation_y: inv.rotation_y !== undefined && inv.rotation_y !== null 
        ? Number(inv.rotation_y) 
        : (cached?.rotation_y ?? 0),
      surface: inv.surface !== undefined && inv.surface !== null 
        ? String(inv.surface) 
        : (cached?.surface ?? 'floor')
    };
  },

  augmentList(list) {
    if (!Array.isArray(list)) return [];
    return list.map((item) => this.augmentItem(item));
  },

  getAll() {
    return Object.fromEntries(memoryCache);
  }
};

export default positionStore;
