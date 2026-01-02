import React from 'react';
import { useGameContext } from '../context/GameContext';
import { formatTime } from '../utils/gameUtils';
import '../styles/HUD.css';

export const HUD: React.FC = () => {
  const { score, timeRemaining } = useGameContext();

  return (
    <>
      <div id="timer" className="hud-element">
        Time: {formatTime(timeRemaining)}
      </div>
      <div id="score" className="hud-element">
        Score: {score}
      </div>
    </>
  );
};
