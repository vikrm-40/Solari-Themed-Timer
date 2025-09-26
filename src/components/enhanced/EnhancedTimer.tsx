import { useState } from 'react';
import { SplitFlapDisplay } from '../SplitFlapDisplay';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent } from '../ui/enhanced-card';
import { Typography } from '../ui/typography';
import { NumberInput } from '../ui/number-input';
import { Button } from '../ui/button';
import { ProgressRing } from '../ui/progress-ring';
import { ThemeToggle } from '../ui/theme-toggle';
import { useTimer } from '@/hooks/useTimer';
import { toast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw } from 'lucide-react';

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

  const [darkMode, setDarkMode] = useState(isDarkMode);
  
  // Calculate progress for ring
  const totalSeconds = 5 * 60; // Default 5 minutes
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  // Toast notification when timer finishes
  if (isFinished) {
    toast({
      title: "⏰ Time's Up!",
      description: "Your timer has finished!",
      duration: 5000,
    });
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
        : 'bg-gradient-to-br from-background via-background to-secondary/20'
    } flex flex-col items-center justify-center p-4`}>
      
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle isDark={darkMode} onToggle={toggleTheme} />
      </div>

      {/* Header Card */}
      <EnhancedCard variant="glass" className="mb-8 max-w-md w-full">
        <EnhancedCardHeader>
          <Typography 
            variant="title" 
            font="display" 
            weight="bold" 
            gradient={true}
            className={darkMode ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent' : ''}
          >
            Timer
          </Typography>
        </EnhancedCardHeader>
      </EnhancedCard>

      {/* Main Timer Display Card */}
      <EnhancedCard variant="glass" glow={isRunning} className="mb-8 max-w-2xl w-full">
        <EnhancedCardContent className="text-center">
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* Progress Ring */}
            <ProgressRing 
              value={progress} 
              size={100} 
              className="hidden md:block"
            />
            
            {/* Split Flap Display */}
            <SplitFlapDisplay 
              minutes={minutes} 
              seconds={seconds}
              size="lg"
              variant={darkMode ? 'dark' : 'light'}
            />
            
            {/* Progress Ring (mobile) */}
            <ProgressRing 
              value={progress} 
              size={80} 
              className="md:hidden"
            />
          </div>

          {/* Timer Status */}
          {isFinished && (
            <Typography variant="heading" weight="bold" className="text-green-400 mb-4">
              🎉 Time's Up!
            </Typography>
          )}
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Controls Card */}
      <EnhancedCard variant="glass" className="w-full max-w-md">
        <EnhancedCardContent>
          {/* Time Input Controls (only show when not running) */}
          {!isRunning && (
            <div className="flex justify-center gap-8 mb-6">
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
              variant={isRunning ? "secondary" : "gradient"}
              size="lg"
              onClick={isRunning ? pause : start}
              className="flex-1 max-w-32"
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
              className="hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </div>
  );
};

export { EnhancedTimer };