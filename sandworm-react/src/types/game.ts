// Game types for Sandworm

export interface Position {
  x: number;
  y: number;
}

export interface Direction {
  x: number;
  y: number;
}

export interface SnakeSegment extends Position {}

export interface Fremen extends Position {
  direction: Direction;
  isSuper: boolean;
  lastUpdate?: number;
  changeDirectionTime?: number;
}

export interface GameState {
  snake: SnakeSegment[];
  fremen: Fremen[];
  direction: Direction;
  score: number;
  timeRemaining: number;
  gameRunning: boolean;
  isPaused: boolean;
}

export interface Highscore {
  initials: string;
  score: number;
}

export const GameStatus = {
  Menu: 'menu',
  Playing: 'playing',
  Paused: 'paused',
  GameOver: 'gameover',
} as const;

export type GameStatus = typeof GameStatus[keyof typeof GameStatus];

export interface AudioManager {
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  playMainScreenMusic: () => void;
  stopMainScreenMusic: () => void;
  playChompSound: () => void;
  playSwallowSound: () => void;
  playSuperFremenSound: () => void;
  playBlipSound: () => void;
}
