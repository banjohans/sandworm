// Game constants

export const INITIAL_TIME = 180; // 3 minutes in seconds
export const NUM_FREMEN = 3;
export const SUPER_FREMEN_PROBABILITY = 0.2; // 20% chance
export const SUPER_FREMEN_BONUS_POINTS = 50;
export const REGULAR_FREMEN_POINTS = 10;
export const WARP_PENALTY = 5;

export const GAME_SPEED = 120; // Snake movement interval in ms
export const FREMEN_SPEED = 200; // Fremen movement interval in ms
export const DIRECTION_CHANGE_INTERVAL = 3000; // Direction change interval in ms

// Calculate dynamic grid size based on viewport
export const calculateGridSize = (): number => {
  const baseSize = Math.min(window.innerWidth, window.innerHeight) / 50;
  return Math.floor(baseSize);
};

// Directions
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// Audio volume settings
export const AUDIO_VOLUMES = {
  BACKGROUND_MUSIC: 0.8,
  MAINSCREEN_MUSIC: 0.7,
  CHOMP: 0.2,
  SWALLOW: 1.0,
  SUPER_FREMEN: 0.2,
  BLIP: 0.2,
};
