import React from 'react';
import { useGameContext } from '../context/GameContext';
import { GameStatus } from '../types/game';
import { getHighscore } from '../utils/storage';
import '../styles/HomeScreen.css';

interface HomeScreenProps {
  onStartGame: () => void;
  onShowRules: () => void;
  finalScore?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, onShowRules, finalScore }) => {
  const { gameStatus } = useGameContext();
  const highscore = getHighscore();

  const handleShare = () => {
    const gameUrl = window.location.href;
    navigator.clipboard
      .writeText(gameUrl)
      .then(() => alert('Game URL copied to clipboard!'))
      .catch((err) => console.error('Failed to copy URL:', err));
  };

  if (gameStatus !== GameStatus.Menu && gameStatus !== GameStatus.GameOver) {
    return null;
  }

  const isGameOver = gameStatus === GameStatus.GameOver;

  return (
    <div id="home-screen">
      <div id="menu-content">
        {isGameOver && finalScore !== undefined && (
          <div id="game-over-message">
            <h2>Game Over!</h2>
            <p>Your final score: <span id="final-score">{finalScore}</span></p>
          </div>
        )}
        <div id="button-container">
          <button id="start-game-button" className="menu-button" onClick={onStartGame}>
            Start Game
          </button>
          <button id="rules-button" className="menu-button" onClick={onShowRules}>
            Rules
          </button>
          <button id="share-button" className="menu-button" onClick={handleShare}>
            Share
          </button>
          <div id="highscore-section">
            <p id="highscore-display">Highscore: {highscore.initials} - {highscore.score}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
