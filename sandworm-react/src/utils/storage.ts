import type { Highscore } from '../types/game';

const HIGHSCORE_KEY = 'highscore';

// Get highscore from localStorage
export const getHighscore = (): Highscore => {
  const storedHighscore = localStorage.getItem(HIGHSCORE_KEY);
  
  try {
    return storedHighscore
      ? JSON.parse(storedHighscore)
      : { initials: 'AAA', score: 0 };
  } catch (error) {
    console.error('Failed to parse highscore:', error);
    localStorage.removeItem(HIGHSCORE_KEY);
    return { initials: 'AAA', score: 0 };
  }
};

// Save highscore to localStorage
export const saveHighscore = (score: number): Highscore => {
  const currentHighscore = getHighscore();

  if (score > currentHighscore.score) {
    const initials = prompt('Congratulations! Enter your initials (3 letters):')
      ?.toUpperCase()
      .slice(0, 3);

    if (!initials) {
      console.warn('Highscore update canceled: No initials entered.');
      return currentHighscore;
    }

    const newHighscore = { initials, score };
    localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(newHighscore));
    console.log('New highscore saved:', newHighscore);
    return newHighscore;
  }

  return currentHighscore;
};
