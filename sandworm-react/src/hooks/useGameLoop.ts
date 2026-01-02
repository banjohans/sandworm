import { useEffect, useCallback, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import { GameStatus } from '../types/game';
import {
  calculateGridSize,
  GAME_SPEED,
  FREMEN_SPEED,
  DIRECTION_CHANGE_INTERVAL,
  REGULAR_FREMEN_POINTS,
  SUPER_FREMEN_BONUS_POINTS,
  WARP_PENALTY,
  NUM_FREMEN,
  SUPER_FREMEN_PROBABILITY,
} from '../utils/constants';
import {
  getMaxBounds,
  randomDirection,
  checkCollision,
  randomPosition,
  isPositionOccupied,
  wrapPosition,
} from '../utils/gameUtils';
import { useAudioManager } from './useAudioManager';

export const useGameLoop = () => {
  const {
    snake,
    direction,
    gameRunning,
    setSnake,
    setFremen,
    setDirection,
    setScore,
    setTimeRemaining,
    gameStatus,
    setGameStatus,
    incrementScore,
  } = useGameContext();

  const {
    playChompSound,
    playSwallowSound,
    playSuperFremenSound,
    playBlipSound,
  } = useAudioManager();

  const gameIntervalRef = useRef<number | null>(null);
  const fremenIntervalRef = useRef<number | null>(null);
  const directionIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const superFremenTimeoutRef = useRef<number | null>(null);
  const growingRef = useRef(false);

  // Move snake and check collisions
  const moveSnake = useCallback(() => {
    const gridSize = calculateGridSize();
    
    setSnake((prevSnake) => {
      const head = {
        x: prevSnake[0].x + direction.x * gridSize,
        y: prevSnake[0].y + direction.y * gridSize,
      };

      // Wrap around screen
      const wrappedHead = wrapPosition(head, window.innerWidth, window.innerHeight);

      const newSnake = [wrappedHead, ...prevSnake];
      
      if (!growingRef.current) {
        newSnake.pop();
      } else {
        growingRef.current = false;
      }

      return newSnake;
    });

    // Check collisions after movement (using latest snake state from closure)
    setFremen((prevFremen) => {
      const head = snake[0];
      let newFremen = [...prevFremen];
      const toRemove: number[] = [];

      prevFremen.forEach((f, index) => {
        if (checkCollision(head, f, gridSize)) {
          growingRef.current = true;

          if (f.isSuper) {
            playSwallowSound();
            incrementScore(SUPER_FREMEN_BONUS_POINTS);
          } else {
            playChompSound();
            incrementScore(REGULAR_FREMEN_POINTS);
          }

          toRemove.push(index);
        }
      });

      // Remove eaten fremen and add new ones
      if (toRemove.length > 0) {
        newFremen = newFremen.filter((_, i) => !toRemove.includes(i));
        
        // Add two new fremen for each eaten
        toRemove.forEach(() => {
          for (let i = 0; i < 2; i++) {
            const { maxX, maxY } = getMaxBounds();
            let newPos = randomPosition(gridSize, maxX, maxY);
            
            while (isPositionOccupied(newPos, snake, newFremen)) {
              newPos = randomPosition(gridSize, maxX, maxY);
            }

            newFremen.push({
              ...newPos,
              direction: randomDirection(),
              isSuper: false,
              changeDirectionTime: Date.now() + Math.random() * 4000 + 2000,
            });
          }
        });
      }

      return newFremen;
    });
  }, [direction, snake, setSnake, setFremen, playChompSound, playSwallowSound, incrementScore]);

  // Move fremen
  const moveFremen = useCallback(() => {
    const gridSize = calculateGridSize();
    const { maxX, maxY } = getMaxBounds();
    const currentTime = Date.now();

    setFremen((prevFremen) =>
      prevFremen.map((f) => {
        const updateInterval = f.isSuper ? 100 : 200;

        if (!f.lastUpdate || currentTime - f.lastUpdate >= updateInterval) {
          let newX = f.x + f.direction.x * gridSize;
          let newY = f.y + f.direction.y * gridSize;

          // Bounce off walls
          if (newX < 0 || newX > maxX) {
            f.direction.x *= -1;
            newX = f.x + f.direction.x * gridSize;
          }
          if (newY < 0 || newY > maxY) {
            f.direction.y *= -1;
            newY = f.y + f.direction.y * gridSize;
          }

          return {
            ...f,
            x: Math.round(newX / gridSize) * gridSize,
            y: Math.round(newY / gridSize) * gridSize,
            lastUpdate: currentTime,
          };
        }

        return f;
      })
    );
  }, [setFremen]);

  // Randomize fremen direction
  const randomizeFremenDirection = useCallback(() => {
    setFremen((prevFremen) =>
      prevFremen.map((f) => ({
        ...f,
        direction: randomDirection(),
      }))
    );
  }, [setFremen]);

  // Spawn initial fremen
  const spawnInitialFremen = useCallback(() => {
    const gridSize = calculateGridSize();
    const { maxX, maxY } = getMaxBounds();
    const newFremen = [];

    while (newFremen.length < NUM_FREMEN) {
      let pos = randomPosition(gridSize, maxX, maxY);
      
      while (isPositionOccupied(pos, snake, newFremen)) {
        pos = randomPosition(gridSize, maxX, maxY);
      }

      newFremen.push({
        ...pos,
        direction: randomDirection(),
        isSuper: Math.random() < SUPER_FREMEN_PROBABILITY,
        changeDirectionTime: Date.now() + Math.random() * 4000 + 2000,
      });
    }

    setFremen(newFremen);
  }, [snake, setFremen]);

  // Spawn super fremen
  const scheduleSuperFremen = useCallback(() => {
    if (superFremenTimeoutRef.current) return;

    const minDelay = 60000; // 1 minute
    const maxDelay = 120000; // 2 minutes
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    superFremenTimeoutRef.current = setTimeout(() => {
      const gridSize = calculateGridSize();
      const { maxX, maxY } = getMaxBounds();
      
      setFremen((prevFremen) => {
        // Don't spawn if there's already a super fremen
        if (prevFremen.some((f) => f.isSuper)) return prevFremen;

        let pos = randomPosition(gridSize, maxX, maxY);
        
        while (isPositionOccupied(pos, snake, prevFremen)) {
          pos = randomPosition(gridSize, maxX, maxY);
        }

        playSuperFremenSound();

        return [
          ...prevFremen,
          {
            ...pos,
            direction: randomDirection(),
            isSuper: true,
          },
        ];
      });

      superFremenTimeoutRef.current = null;
      scheduleSuperFremen();
    }, randomDelay);
  }, [snake, setFremen, playSuperFremenSound]);

  // Update timer
  const updateTimer = useCallback(() => {
    setTimeRemaining((prev) => {
      if (prev <= 0) {
        setGameStatus(GameStatus.GameOver);
        return 0;
      }

      // Play blip sound in last 10 seconds
      if (prev <= 10 && prev > 0) {
        playBlipSound();
      }

      return prev - 1;
    });
  }, [setTimeRemaining, setGameStatus, playBlipSound]);

  // Start game intervals
  const startGameIntervals = useCallback(() => {
    gameIntervalRef.current = setInterval(moveSnake, GAME_SPEED);
    fremenIntervalRef.current = setInterval(moveFremen, FREMEN_SPEED);
    directionIntervalRef.current = setInterval(randomizeFremenDirection, DIRECTION_CHANGE_INTERVAL);
    timerIntervalRef.current = setInterval(updateTimer, 1000);
  }, [moveSnake, moveFremen, randomizeFremenDirection, updateTimer]);

  // Stop game intervals
  const stopGameIntervals = useCallback(() => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (fremenIntervalRef.current) clearInterval(fremenIntervalRef.current);
    if (directionIntervalRef.current) clearInterval(directionIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (superFremenTimeoutRef.current) clearTimeout(superFremenTimeoutRef.current);
  }, []);

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameStatus !== GameStatus.Playing) return;

      const { direction: currentDirection } = { direction };

      switch (e.key) {
        case 'ArrowUp':
          if (currentDirection.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (currentDirection.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (currentDirection.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (currentDirection.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    },
    [direction, gameStatus, setDirection]
  );

  // Handle mouse click (warp)
  const handleMouseClick = useCallback(
    (e: MouseEvent) => {
      if (gameStatus !== GameStatus.Playing) return;

      const gridSize = calculateGridSize();
      const newHeadX = Math.floor(e.clientX / gridSize) * gridSize;
      const newHeadY = Math.floor(e.clientY / gridSize) * gridSize;

      setSnake((prevSnake) => [{ x: newHeadX, y: newHeadY }, ...prevSnake.slice(0, prevSnake.length - 1)]);
      setScore((prev) => Math.max(0, prev - WARP_PENALTY));
    },
    [gameStatus, setSnake, setScore]
  );

  // Setup and cleanup game intervals
  useEffect(() => {
    if (gameStatus === GameStatus.Playing && gameRunning) {
      startGameIntervals();
      scheduleSuperFremen();
    }

    return () => {
      stopGameIntervals();
    };
  }, [gameStatus, gameRunning, startGameIntervals, stopGameIntervals, scheduleSuperFremen]);

  // Setup event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleMouseClick);
    };
  }, [handleKeyDown, handleMouseClick]);

  return {
    spawnInitialFremen,
    stopGameIntervals,
  };
};
