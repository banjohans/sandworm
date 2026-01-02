import type { Direction, Position } from '../types/game';
import { DIRECTIONS, calculateGridSize } from './constants';

// Get maximum bounds for spawning entities
export const getMaxBounds = (): { maxX: number; maxY: number } => {
  const gridSize = calculateGridSize();
  const maxX = Math.floor(window.innerWidth / gridSize) * gridSize - gridSize;
  const maxY = Math.floor(window.innerHeight / gridSize) * gridSize - gridSize;
  return { maxX, maxY };
};

// Get a random direction
export const randomDirection = (): Direction => {
  const directions = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];
  return directions[Math.floor(Math.random() * directions.length)];
};

// Check if two positions collide
export const checkCollision = (pos1: Position, pos2: Position, hitboxSize: number): boolean => {
  const distanceX = Math.abs(pos1.x - pos2.x);
  const distanceY = Math.abs(pos1.y - pos2.y);
  return distanceX < hitboxSize && distanceY < hitboxSize;
};

// Generate random position on grid
export const randomPosition = (gridSize: number, maxX: number, maxY: number): Position => {
  return {
    x: Math.floor(Math.random() * (maxX / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (maxY / gridSize)) * gridSize,
  };
};

// Check if position is occupied
export const isPositionOccupied = (
  position: Position,
  snake: Position[],
  fremen: Position[]
): boolean => {
  const snakeOccupied = snake.some((seg) => seg.x === position.x && seg.y === position.y);
  const fremenOccupied = fremen.some((f) => f.x === position.x && f.y === position.y);
  return snakeOccupied || fremenOccupied;
};

// Format time as MM:SS
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Wrap position around screen boundaries
export const wrapPosition = (pos: Position, width: number, height: number): Position => {
  return {
    x: (pos.x + width) % width,
    y: (pos.y + height) % height,
  };
};
