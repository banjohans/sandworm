import React, { useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { GameStatus } from '../types/game';
import { Snake } from './Snake';
import { Fremen } from './Fremen';
import { HUD } from './HUD';
import { useGameLoop } from '../hooks/useGameLoop';
import { useSwipeControls } from '../hooks/useSwipeControls';
import '../styles/GameContainer.css';

interface GameContainerProps {
  onExit: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({ onExit }) => {
  const { snake, fremen, gameStatus } = useGameContext();
  const { spawnInitialFremen, stopGameIntervals } = useGameLoop();
  
  // Enable swipe controls
  useSwipeControls();

  // Spawn initial fremen when game starts
  useEffect(() => {
    if (gameStatus === GameStatus.Playing) {
      spawnInitialFremen();
    }
  }, [gameStatus, spawnInitialFremen]);

  // Stop intervals when game ends
  useEffect(() => {
    if (gameStatus === GameStatus.GameOver || gameStatus === GameStatus.Menu) {
      stopGameIntervals();
    }
  }, [gameStatus, stopGameIntervals]);

  if (gameStatus !== GameStatus.Playing) {
    return null;
  }

  return (
    <div id="game-container">
      <button id="exit-button" className="menu-button" onClick={onExit}>
        Exit
      </button>
      <HUD />
      <Snake segments={snake} />
      <Fremen fremen={fremen} />
    </div>
  );
};
