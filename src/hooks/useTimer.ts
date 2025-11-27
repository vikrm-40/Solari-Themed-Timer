import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'timer-state';

const getInitialState = (initialMinutes: number, initialSeconds: number) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored);
      
      // If timer was running, calculate elapsed time
      if (state.isRunning && state.lastUpdate) {
        const elapsed = Math.floor((Date.now() - state.lastUpdate) / 1000);
        const totalSeconds = state.minutes * 60 + state.seconds - elapsed;
        
        if (totalSeconds <= 0) {
          return {
            minutes: 0,
            seconds: 0,
            originalMinutes: state.originalMinutes,
            originalSeconds: state.originalSeconds,
            isRunning: false,
            isFinished: true,
          };
        }
        
        return {
          minutes: Math.floor(totalSeconds / 60),
          seconds: totalSeconds % 60,
          originalMinutes: state.originalMinutes,
          originalSeconds: state.originalSeconds,
          isRunning: true,
          isFinished: false,
        };
      }
      
      return {
        minutes: state.minutes,
        seconds: state.seconds,
        originalMinutes: state.originalMinutes,
        originalSeconds: state.originalSeconds,
        isRunning: false,
        isFinished: state.isFinished,
      };
    }
  } catch (error) {
    console.error('Error loading timer state:', error);
  }
  
  return {
    minutes: initialMinutes,
    seconds: initialSeconds,
    originalMinutes: initialMinutes,
    originalSeconds: initialSeconds,
    isRunning: false,
    isFinished: false,
  };
};

export const useTimer = (initialMinutes: number = 5, initialSeconds: number = 0) => {
  const initialState = getInitialState(initialMinutes, initialSeconds);
  
  const [minutes, setMinutes] = useState(initialState.minutes);
  const [seconds, setSeconds] = useState(initialState.seconds);
  const [originalMinutes, setOriginalMinutes] = useState(initialState.originalMinutes);
  const [originalSeconds, setOriginalSeconds] = useState(initialState.originalSeconds);
  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  const [isFinished, setIsFinished] = useState(initialState.isFinished);

  // Save state to localStorage
  useEffect(() => {
    try {
      const state = {
        minutes,
        seconds,
        originalMinutes,
        originalSeconds,
        isRunning,
        isFinished,
        lastUpdate: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving timer state:', error);
    }
  }, [minutes, seconds, originalMinutes, originalSeconds, isRunning, isFinished]);

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
    setMinutes(0);
    setSeconds(0);
  }, []);

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