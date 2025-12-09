import { useState, useEffect, useRef } from 'react';
import { SplitFlapDisplay } from '../SplitFlapDisplay';
import { Typography } from '../ui/typography';
import { NumberInput } from '../ui/number-input';
import { Button } from '../ui/button';
import { SoundSelector } from '../SoundSelector';
import { TimerPresets } from '../TimerPresets';
import { SessionStats } from '../SessionStats';
import { ThemeToggle } from '../ui/theme-toggle';
import { useTimer } from '@/hooks/useTimer';
import { useSoundSettings } from '@/hooks/useSoundSettings';
import { useTheme } from '@/hooks/useTheme';
import { useSolariSound } from '@/hooks/useSolariSound';
import { toast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const EnhancedTimer = () => {
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
    setTime,
  } = useTimer(5, 0);

  const { sound, volume, setSound, setVolume, playSound } = useSoundSettings();
  const { isDark, toggleTheme } = useTheme();
  const { playFlipSound } = useSolariSound();
  const [showSettings, setShowSettings] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const prevMinutes = useRef(minutes);
  const prevSeconds = useRef(seconds);
  const [initialTotalSeconds, setInitialTotalSeconds] = useState(5 * 60);
  const [completedSessionTime, setCompletedSessionTime] = useState(0);

  // Track initial timer value when timer starts
  useEffect(() => {
    if (isRunning && !hasPlayedSound) {
      const total = minutes * 60 + seconds;
      if (total > 0) {
        setInitialTotalSeconds(total);
      }
    }
  }, [isRunning]);

  // Play Solari flip sound when digits change
  useEffect(() => {
    if (isRunning && (prevMinutes.current !== minutes || prevSeconds.current !== seconds)) {
      playFlipSound();
    }
    prevMinutes.current = minutes;
    prevSeconds.current = seconds;
  }, [minutes, seconds, isRunning, playFlipSound]);

  // Play sound and show toast when timer finishes
  useEffect(() => {
    if (isFinished && !hasPlayedSound) {
      playSound();
      setHasPlayedSound(true);
      setCompletedSessionTime(initialTotalSeconds);
      toast({
        title: "⏰ Time's Up!",
        description: "Your timer has finished!",
        duration: 5000,
      });
    } else if (!isFinished) {
      setHasPlayedSound(false);
    }
  }, [isFinished, hasPlayedSound, playSound, initialTotalSeconds]);

  const handlePresetSelect = (presetMinutes: number, presetSeconds: number) => {
    if (!isRunning) {
      setTime(presetMinutes, presetSeconds);
      setInitialTotalSeconds(presetMinutes * 60 + presetSeconds);
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-700 flex items-center justify-center p-4 md:p-8",
      "bg-background"
    )}>
      
      {/* Bento Grid Layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        
        {/* Left Column - Timer Display */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Header */}
          <div className="text-center lg:text-left">
            <Typography 
              variant="title" 
              font="mono" 
              weight="black" 
              className="tracking-tighter text-foreground text-3xl lg:text-4xl"
            >
              Solari Timer
            </Typography>
            <p className="text-sm text-muted-foreground font-mono tracking-wide mt-1">
              Industrial Precision • Digital Tactility
            </p>
          </div>

          {/* Main Timer Card - Flex grow to fill space */}
          <div className="bento-card p-6 lg:p-10 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-center">
              <SplitFlapDisplay 
                minutes={minutes} 
                seconds={seconds}
                size="xl"
                variant={isDark ? 'dark' : 'light'}
              />
            </div>

            {/* Timer Status */}
            {isFinished && (
              <div className="mt-6 text-center">
                <Typography variant="heading" weight="bold" className="text-timer-finished animate-pulse text-xl">
                  🎉 Time's Up!
                </Typography>
              </div>
            )}
          </div>

          {/* Controls Card */}
          <div className="bento-card p-4">
            <div className="flex justify-center gap-4">
              <Button
                variant={isRunning ? "secondary" : "default"}
                size="lg"
                onClick={isRunning ? pause : start}
                className={cn(
                  "flex-1 max-w-40 transition-all duration-300 font-mono font-bold tracking-wider text-base",
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

          {/* Stats Card */}
          <div className="bento-card p-4">
            <SessionStats currentSessionTime={completedSessionTime} />
          </div>
        </div>

        {/* Right Column - Controls + Presets */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Settings Controls */}
          <div className="flex justify-end gap-2">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "transition-all duration-300 backdrop-blur-md bg-card/50 border-border/50",
                showSettings && "bg-primary/10 border-primary/50"
              )}
            >
              <Settings2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Settings Card */}
          {showSettings && (
            <div className="bento-card p-4 animate-fade-in">
              <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground mb-3">
                Sound Settings
              </h3>
              <SoundSelector
                selectedSound={sound}
                volume={volume}
                onSoundChange={setSound}
                onVolumeChange={setVolume}
              />
            </div>
          )}

          {/* Time Input Controls - Flex grow to match timer card */}
          {!isRunning && (
            <div className="bento-card p-4 flex-1 flex flex-col justify-center">
              <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground mb-3">
                Set Timer
              </h3>
              <div className="flex justify-center gap-4">
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
            </div>
          )}

          {/* Placeholder when running to maintain layout */}
          {isRunning && (
            <div className="flex-1" />
          )}

          {/* Presets Card */}
          <div className="bento-card p-4">
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground mb-3">
              Quick Presets
            </h3>
            <TimerPresets onPresetSelect={handlePresetSelect} disabled={isRunning} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { EnhancedTimer };