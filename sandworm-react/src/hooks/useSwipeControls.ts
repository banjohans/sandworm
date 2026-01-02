import { useEffect, useRef, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { GameStatus } from '../types/game';

export const useSwipeControls = () => {
  const { direction, setDirection, gameStatus } = useGameContext();
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (gameStatus !== GameStatus.Playing) return;

      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;

      const diffX = endX - startXRef.current;
      const diffY = endY - startYRef.current;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && direction.x === 0) {
          setDirection({ x: 1, y: 0 }); // Right
        } else if (diffX < 0 && direction.x === 0) {
          setDirection({ x: -1, y: 0 }); // Left
        }
      } else {
        // Vertical swipe
        if (diffY > 0 && direction.y === 0) {
          setDirection({ x: 0, y: 1 }); // Down
        } else if (diffY < 0 && direction.y === 0) {
          setDirection({ x: 0, y: -1 }); // Up
        }
      }
    },
    [direction, gameStatus, setDirection]
  );

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
};
