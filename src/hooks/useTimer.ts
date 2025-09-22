import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialMinutes: number = 5, initialSeconds: number = 0) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [originalMinutes, setOriginalMinutes] = useState(initialMinutes);
  const [originalSeconds, setOriginalSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (isRunning && minutes === 0 && seconds === 0) {
      setIsRunning(false);
      setIsFinished(true);
      
      // Play completion sound if available
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIgBSyRzO/Hl0ENHJGQ2OWuUhEWXMDn85xZAQ=');
        audio.play().catch(() => {
          // Ignore if audio can't play
        });
      } catch (error) {
        // Ignore audio errors
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes, seconds]);

  const start = useCallback(() => {
    if (minutes === 0 && seconds === 0) return;
    setIsRunning(true);
    setIsFinished(false);
  }, [minutes, seconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsFinished(false);
    setMinutes(originalMinutes);
    setSeconds(originalSeconds);
  }, [originalMinutes, originalSeconds]);

  const setInitialTime = useCallback((newMinutes: number, newSeconds: number) => {
    if (!isRunning) {
      setMinutes(newMinutes);
      setSeconds(newSeconds);
      setOriginalMinutes(newMinutes);
      setOriginalSeconds(newSeconds);
      setIsFinished(false);
    }
  }, [isRunning]);

  return {
    minutes,
    seconds,
    isRunning,
    isFinished,
    start,
    pause,
    reset,
    setMinutes: (mins: number) => setInitialTime(mins, seconds),
    setSeconds: (secs: number) => setInitialTime(minutes, secs),
  };
};