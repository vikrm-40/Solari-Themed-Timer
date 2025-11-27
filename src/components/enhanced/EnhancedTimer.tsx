import { useState, useEffect } from 'react';
import { SplitFlapDisplay } from '../SplitFlapDisplay';
import { Typography } from '../ui/typography';
import { NumberInput } from '../ui/number-input';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import { SoundSelector } from '../SoundSelector';
import { ProgressRing } from '../ui/progress-ring';
import { useTimer } from '@/hooks/useTimer';
import { useSoundSettings } from '@/hooks/useSoundSettings';
import { toast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedTimerProps {
  isDarkMode?: boolean;
}

const EnhancedTimer = ({ isDarkMode = false }: EnhancedTimerProps) => {
  const {
    minutes,
    seconds,
    isRunning,
    isFinished,
    start,
    pause,
    reset,
    setMinutes,
    setSeconds,
  } = useTimer(5, 0);

  const { sound, volume, setSound, setVolume, playSound } = useSoundSettings();
  const [darkMode, setDarkMode] = useState(isDarkMode);
  const [showSettings, setShowSettings] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  // Play sound and show toast when timer finishes
  useEffect(() => {
    if (isFinished && !hasPlayedSound) {
      playSound();
      setHasPlayedSound(true);
      toast({
        title: "⏰ Time's Up!",
        description: "Your timer has finished!",
        duration: 5000,
      });
    } else if (!isFinished) {
      setHasPlayedSound(false);
    }
  }, [isFinished, hasPlayedSound, playSound]);

  // Calculate progress for progress ring
  const totalSeconds = 5 * 60; // Default 5 minutes
  const currentSeconds = minutes * 60 + seconds;
  const progress = totalSeconds > 0 ? ((totalSeconds - currentSeconds) / totalSeconds) * 100 : 0;

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Get timer state color
  const getTimerStateColor = () => {
    if (isFinished) return 'text-timer-finished';
    if (isRunning) return 'text-timer-active';
    if (minutes > 0 || seconds > 0) return 'text-timer-paused';
    return 'text-timer-idle';
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-500 flex flex-col items-center justify-center p-4",
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
        : 'bg-gradient-to-br from-background via-background to-secondary/20'
    )}>
      
      {/* Theme Toggle & Settings */}
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            "transition-all duration-300",
            showSettings && "bg-primary/10 border-primary"
          )}
        >
          <Settings2 className="h-5 w-5" />
        </Button>
        <ThemeToggle isDark={darkMode} onToggle={toggleTheme} />
      </div>

      {/* Header */}
      <div className="mb-8 max-w-md w-full text-center">
        <Typography 
          variant="title" 
          font="display" 
          weight="bold" 
          gradient={true}
          className={darkMode ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent' : ''}
        >
          Timer
        </Typography>
      </div>

      {/* Main Timer Display */}
      <div className="mb-8 max-w-2xl w-full text-center">
        <div className={cn(
          "relative flex items-center justify-center mb-6 transition-all duration-500",
          isRunning && "timer-glow-active"
        )}>
          {/* Progress Ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <ProgressRing 
              value={progress} 
              size={360}
              strokeWidth={8}
              className={cn(
                "transition-opacity duration-500",
                isRunning ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
          
          {/* Split Flap Display */}
          <div className={cn(
            "relative transition-transform duration-300",
            isRunning && "timer-pulse-animation"
          )}>
            <SplitFlapDisplay 
              minutes={minutes} 
              seconds={seconds}
              size="lg"
              variant={darkMode ? 'dark' : 'light'}
            />
          </div>
        </div>

        {/* Timer Status */}
        {isFinished && (
          <Typography variant="heading" weight="bold" className="text-timer-finished mb-4 animate-pulse">
            🎉 Time's Up!
          </Typography>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-md space-y-6">
        {/* Sound Settings Panel */}
        {showSettings && (
          <div className="glass-card p-6 rounded-xl animate-fade-in">
            <SoundSelector
              selectedSound={sound}
              volume={volume}
              onSoundChange={setSound}
              onVolumeChange={setVolume}
            />
          </div>
        )}

        {/* Time Input Controls (only show when not running) */}
        {!isRunning && (
          <div className="flex justify-center gap-8">
            <NumberInput
              value={minutes}
              onChange={setMinutes}
              min={0}
              max={59}
              label="Minutes"
            />
            <NumberInput
              value={seconds}
              onChange={setSeconds}
              min={0}
              max={59}
              label="Seconds"
            />
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant={isRunning ? "secondary" : "default"}
            size="lg"
            onClick={isRunning ? pause : start}
            className={cn(
              "flex-1 max-w-32 transition-all duration-300",
              isRunning && "bg-timer-paused hover:bg-timer-paused/90",
              !isRunning && minutes === 0 && seconds === 0 && "opacity-50 cursor-not-allowed"
            )}
            disabled={!isRunning && minutes === 0 && seconds === 0}
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={reset}
            className="hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all duration-300"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { EnhancedTimer };