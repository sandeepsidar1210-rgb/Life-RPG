/**
 * companionSpots.js
 * Dedicated companion pet anchor positions per room.
 * Companions have fixed perch spots so they don't block user-placed decor.
 */

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
