import React, { useState, useEffect } from 'react';
import { GameProvider } from './context/GameContext';
import { useGameContext } from './context/GameContext';
import { GameStatus } from './types/game';
import { HomeScreen } from './components/HomeScreen';
import { RulesOverlay } from './components/RulesOverlay';
import { GameContainer } from './components/GameContainer';
import { AudioElements } from './components/AudioElements';
import { useAudioManager } from './hooks/useAudioManager';
import { saveHighscore } from './utils/storage';
import './App.css';

const AppContent: React.FC = () => {
  const { gameStatus, setGameStatus, resetGame, score, setGameRunning } = useGameContext();
  const [showRules, setShowRules] = useState(false);
  const [finalScore, setFinalScore] = useState<number | undefined>(undefined);
  const {
    initAudio,
    playBackgroundMusic,
    stopBackgroundMusic,
    playMainScreenMusic,
    stopMainScreenMusic,
  } = useAudioManager();

  // Initialize audio on mount
  useEffect(() => {
    initAudio();
    playMainScreenMusic();
  }, [initAudio, playMainScreenMusic]);

  // Handle game status changes
  useEffect(() => {
    if (gameStatus === GameStatus.Playing) {
      stopMainScreenMusic();
      playBackgroundMusic();
    } else if (gameStatus === GameStatus.Menu || gameStatus === GameStatus.GameOver) {
      stopBackgroundMusic();
      playMainScreenMusic();
    }
  }, [gameStatus, playBackgroundMusic, stopBackgroundMusic, playMainScreenMusic, stopMainScreenMusic]);

  // Handle game over
  useEffect(() => {
    if (gameStatus === GameStatus.GameOver) {
      setFinalScore(score);
      saveHighscore(score);
      setGameRunning(false);
    }
  }, [gameStatus, score, setGameRunning]);

  const handleStartGame = () => {
    resetGame();
    setGameStatus(GameStatus.Playing);
    setGameRunning(true);
    setFinalScore(undefined);
  };

  const handleShowRules = () => {
    setShowRules(true);
  };

  const handleCloseRules = () => {
    setShowRules(false);
  };

  const handleExit = () => {
    saveHighscore(score);
    setFinalScore(score);
    setGameStatus(GameStatus.GameOver);
    setGameRunning(false);
  };

  return (
    <div className="app">
      <AudioElements />
      <HomeScreen 
        onStartGame={handleStartGame} 
        onShowRules={handleShowRules}
        finalScore={finalScore}
      />
      <RulesOverlay isVisible={showRules} onClose={handleCloseRules} />
      <GameContainer onExit={handleExit} />
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
