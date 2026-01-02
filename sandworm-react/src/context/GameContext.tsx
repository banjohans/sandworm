import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { GameState, Direction } from '../types/game';
import { GameStatus } from '../types/game';
import { DIRECTIONS, INITIAL_TIME } from '../utils/constants';

interface GameContextType extends GameState {
  gameStatus: GameStatus;
  setGameStatus: (status: GameStatus) => void;
  setSnake: React.Dispatch<React.SetStateAction<GameState['snake']>>;
  setFremen: React.Dispatch<React.SetStateAction<GameState['fremen']>>;
  setDirection: React.Dispatch<React.SetStateAction<Direction>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  setGameRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  resetGame: () => void;
  incrementScore: (points: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Menu);
  const [snake, setSnake] = useState<GameState['snake']>([{ x: 200, y: 200 }]);
  const [fremen, setFremen] = useState<GameState['fremen']>([]);
  const [direction, setDirection] = useState<Direction>(DIRECTIONS.RIGHT);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [gameRunning, setGameRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const resetGame = useCallback(() => {
    setSnake([{ x: 200, y: 200 }]);
    setFremen([]);
    setDirection(DIRECTIONS.RIGHT);
    setScore(0);
    setTimeRemaining(INITIAL_TIME);
    setGameRunning(false);
    setIsPaused(false);
  }, []);

  const incrementScore = useCallback((points: number) => {
    setScore((prev) => prev + points);
  }, []);

  const value: GameContextType = {
    snake,
    fremen,
    direction,
    score,
    timeRemaining,
    gameRunning,
    isPaused,
    gameStatus,
    setGameStatus,
    setSnake,
    setFremen,
    setDirection,
    setScore,
    setTimeRemaining,
    setGameRunning,
    setIsPaused,
    resetGame,
    incrementScore,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
