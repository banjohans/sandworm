import React from 'react';
import type { SnakeSegment } from '../types/game';
import { calculateGridSize } from '../utils/constants';
import '../styles/Snake.css';

interface SnakeProps {
  segments: SnakeSegment[];
}

export const Snake: React.FC<SnakeProps> = ({ segments }) => {
  const gridSize = calculateGridSize();

  return (
    <>
      {segments.map((segment, index) => (
        <div
          key={index}
          className="snake"
          style={{
            left: `${segment.x}px`,
            top: `${segment.y}px`,
            width: `${gridSize}px`,
            height: `${gridSize}px`,
          }}
        />
      ))}
    </>
  );
};
