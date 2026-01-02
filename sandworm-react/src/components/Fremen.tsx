import React from 'react';
import type { Fremen as FremenType } from '../types/game';
import { calculateGridSize } from '../utils/constants';
import '../styles/Fremen.css';

interface FremenProps {
  fremen: FremenType[];
}

export const Fremen: React.FC<FremenProps> = ({ fremen }) => {
  const gridSize = calculateGridSize();

  const getRotation = (direction: { x: number; y: number }) => {
    if (direction.x === 1) return 0; // Right
    if (direction.x === -1) return 180; // Left
    if (direction.y === -1) return 270; // Up
    if (direction.y === 1) return 90; // Down
    return 0;
  };

  return (
    <>
      {fremen.map((f, index) => (
        <div
          key={index}
          className={`pacman ${f.isSuper ? 'super-pacman' : ''}`}
          style={{
            left: `${f.x}px`,
            top: `${f.y}px`,
            width: `${gridSize}px`,
            height: `${gridSize}px`,
            transform: `rotate(${getRotation(f.direction)}deg)`,
          }}
        >
          <div className="pacman_eye" />
          <div className="pacman_mouth" />
        </div>
      ))}
    </>
  );
};
