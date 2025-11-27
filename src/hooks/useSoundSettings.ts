import { useState, useEffect } from 'react';
import { SoundOption } from '@/components/SoundSelector';

const SOUND_STORAGE_KEY = 'timer-sound-settings';

interface SoundSettings {
  sound: SoundOption;
  volume: number;
}

const soundFrequencies: Record<SoundOption, number> = {
  bell: 800,
  chime: 1200,
  beep: 440,
  gong: 200,
  none: 0
};

export const useSoundSettings = () => {
  const [settings, setSettings] = useState<SoundSettings>(() => {
    try {
      const stored = localStorage.getItem(SOUND_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading sound settings:', error);
    }
    return { sound: 'bell', volume: 0.5 };
  });

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving sound settings:', error);
    }
  }, [settings]);

  const playSound = () => {
    if (settings.sound === 'none') return;
    
    try {
      const frequency = soundFrequencies[settings.sound];
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      const duration = 0.5;
      gainNode.gain.setValueAtTime(settings.volume * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const setSound = (sound: SoundOption) => {
    setSettings(prev => ({ ...prev, sound }));
  };

  const setVolume = (volume: number) => {
    setSettings(prev => ({ ...prev, volume }));
  };

  return {
    sound: settings.sound,
    volume: settings.volume,
    setSound,
    setVolume,
    playSound
  };
};
