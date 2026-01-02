import { useRef, useCallback } from 'react';
import { AUDIO_VOLUMES } from '../utils/constants';

export const useAudioManager = () => {
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const mainscreenMusicRef = useRef<HTMLAudioElement | null>(null);
  const chompSoundsRef = useRef<HTMLAudioElement[]>([]);
  const swallowSoundRef = useRef<HTMLAudioElement | null>(null);
  const superFremenSoundRef = useRef<HTMLAudioElement | null>(null);
  const blipSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return;

    backgroundMusicRef.current = document.getElementById('background-music') as HTMLAudioElement;
    mainscreenMusicRef.current = document.getElementById('mainscreen-music') as HTMLAudioElement;
    swallowSoundRef.current = document.getElementById('swallow-sound') as HTMLAudioElement;
    superFremenSoundRef.current = document.getElementById('lisan-al-gaib') as HTMLAudioElement;
    blipSoundRef.current = document.getElementById('blip-sound') as HTMLAudioElement;

    // Initialize chomp sounds
    chompSoundsRef.current = [
      document.getElementById('chomp1') as HTMLAudioElement,
      document.getElementById('chomp2') as HTMLAudioElement,
      document.getElementById('chomp3') as HTMLAudioElement,
    ];
  }, []);

  const playBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = AUDIO_VOLUMES.BACKGROUND_MUSIC;
      backgroundMusicRef.current.play().catch((err) => console.error('Error playing background music:', err));
    }
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
  }, []);

  const playMainScreenMusic = useCallback(() => {
    if (mainscreenMusicRef.current) {
      mainscreenMusicRef.current.volume = AUDIO_VOLUMES.MAINSCREEN_MUSIC;
      mainscreenMusicRef.current.currentTime = 0;
      mainscreenMusicRef.current.play().catch((err) => console.error('Error playing mainscreen music:', err));
    }
  }, []);

  const stopMainScreenMusic = useCallback(() => {
    if (mainscreenMusicRef.current) {
      mainscreenMusicRef.current.pause();
      mainscreenMusicRef.current.currentTime = 0;
    }
  }, []);

  const playChompSound = useCallback(() => {
    const randomSound = chompSoundsRef.current[Math.floor(Math.random() * chompSoundsRef.current.length)];
    if (randomSound) {
      randomSound.currentTime = 0;
      randomSound.volume = AUDIO_VOLUMES.CHOMP;
      randomSound.play().catch((err) => console.error('Error playing chomp sound:', err));
    }
  }, []);

  const playSwallowSound = useCallback(() => {
    if (swallowSoundRef.current) {
      swallowSoundRef.current.currentTime = 0;
      swallowSoundRef.current.volume = AUDIO_VOLUMES.SWALLOW;
      swallowSoundRef.current.play().catch((err) => console.error('Error playing swallow sound:', err));
    }
  }, []);

  const playSuperFremenSound = useCallback(() => {
    if (superFremenSoundRef.current) {
      superFremenSoundRef.current.currentTime = 0;
      superFremenSoundRef.current.volume = AUDIO_VOLUMES.SUPER_FREMEN;
      superFremenSoundRef.current.play().catch((err) => console.error('Error playing super fremen sound:', err));
    }
  }, []);

  const playBlipSound = useCallback(() => {
    if (blipSoundRef.current) {
      blipSoundRef.current.currentTime = 0;
      blipSoundRef.current.volume = AUDIO_VOLUMES.BLIP;
      blipSoundRef.current.play().catch((err) => console.error('Error playing blip sound:', err));
    }
  }, []);

  return {
    initAudio,
    playBackgroundMusic,
    stopBackgroundMusic,
    playMainScreenMusic,
    stopMainScreenMusic,
    playChompSound,
    playSwallowSound,
    playSuperFremenSound,
    playBlipSound,
  };
};
