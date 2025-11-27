import { useState, useEffect } from 'react';
import { SoundOption } from '@/components/SoundSelector';

const SOUND_STORAGE_KEY = 'timer-sound-settings';

interface SoundSettings {
  sound: SoundOption;
  volume: number;
}

const sounds: Record<SoundOption, string> = {
  bell: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIgBSyRzO/Hl0ENHJGQ2OWuUhEWXMDn85xZAQ==',
  chime: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAhImHcGFjdpiuq49hODZhoNDaqmQdCECZ2vDCdCcILH/N8NaLOQsaabrq5p9PEw5Ppt/us2YgCTiP1e3LfC8JJXbF7tuSQwwVXLHn6adXFgtFnN3wvGQiByyPyu3GmUMQHY6N1eKuUxMYWr3l8ZpaBA==',
  beep: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==',
  gong: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACDh42LZltmfqKzrI1eNTRensnXpmAYBDyX2O++cSQDKnzK792HNgYXZrjo459MEAtOpd7rr2IaAzaO1OzJeSsEI3TC7NqPPggTW67k5aVUEglEnNvuumEfBCuNx+vFlD8PHouP0t+sTxEUWLrj75hYAw==',
  none: ''
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
      const audio = new Audio(sounds[settings.sound]);
      audio.volume = settings.volume;
      audio.play().catch(() => {});
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
