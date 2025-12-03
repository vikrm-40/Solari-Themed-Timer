import { useState, useEffect } from 'react';
import { SplitFlapDisplay } from '../SplitFlapDisplay';
import { Typography } from '../ui/typography';
import { NumberInput } from '../ui/number-input';
import { Button } from '../ui/button';
import { SoundSelector } from '../SoundSelector';
import { ProgressRing } from '../ui/progress-ring';
import { TimerPresets } from '../TimerPresets';
import { SessionStats } from '../SessionStats';
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
    setTime,
  } = useTimer(5, 0);

  const { sound, volume, setSound, setVolume, playSound } = useSoundSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
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

  // Calculate progress for progress ring - counts DOWN from 100% to 0%
  const currentSeconds = minutes * 60 + seconds;
  const progress = initialTotalSeconds > 0 ? (currentSeconds / initialTotalSeconds) * 100 : 0;

  // Get timer state color
  const getTimerStateColor = () => {
    if (isFinished) return 'text-timer-finished';
    if (isRunning) return 'text-timer-active';
    if (minutes > 0 || seconds > 0) return 'text-timer-paused';
    return 'text-timer-idle';
  };

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
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Column - Timer Display + Progress */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header */}
          <div className="text-center lg:text-left">
            <Typography 
              variant="title" 
              font="mono" 
              weight="black" 
              className="tracking-tighter text-foreground"
            >
              Solari Timer
            </Typography>
            <p className="text-sm text-muted-foreground font-mono tracking-wide mt-2">
              Industrial Precision • Digital Tactility
            </p>
          </div>

          {/* Main Timer Card - Bento Style */}
          <div className="bento-card p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
              {/* Progress Ring */}
              <div className="relative">
                <ProgressRing 
                  value={progress} 
                  size={200}
                  strokeWidth={8}
                  showText={false}
                  className={cn(
                    "transition-all duration-500",
                    isRunning && "drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                  )}
                />
                {isRunning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold font-mono text-primary">
                        {Math.round(progress)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Split Flap Display */}
              <div className="relative">
                <SplitFlapDisplay 
                  minutes={minutes} 
                  seconds={seconds}
                  size="lg"
                  variant={isDarkMode ? 'dark' : 'light'}
                />
              </div>
            </div>

            {/* Timer Status */}
            {isFinished && (
              <div className="mt-8 text-center">
                <Typography variant="heading" weight="bold" className="text-timer-finished animate-pulse">
                  🎉 Time's Up!
                </Typography>
              </div>
            )}
          </div>

          {/* Controls Card */}
          <div className="bento-card p-6">
            <div className="space-y-6">
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
                    "flex-1 max-w-40 transition-all duration-300 font-mono font-bold tracking-wider",
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
        </div>

        {/* Right Column - Controls + Presets + Stats */}
        <div className="lg:col-span-4 space-y-4">
          {/* Settings Controls */}
          <div className="flex justify-end">
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

          {/* Presets Card */}
          <div className="bento-card p-4">
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground mb-3">
              Quick Presets
            </h3>
            <TimerPresets onPresetSelect={handlePresetSelect} disabled={isRunning} />
          </div>

          {/* Stats Card */}
          <div className="bento-card p-4">
            <SessionStats currentSessionTime={completedSessionTime} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { EnhancedTimer };