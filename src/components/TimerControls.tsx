import { Button } from './ui/button';
import { Input } from './ui/input';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface TimerControlsProps {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isFinished: boolean;
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const TimerControls = ({
  minutes,
  seconds,
  isRunning,
  isFinished,
  onMinutesChange,
  onSecondsChange,
  onStart,
  onPause,
  onReset
}: TimerControlsProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      {/* Time Input Controls */}
      {!isRunning && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center text-foreground">Set Timer</h3>
          
          {/* Minutes Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Minutes</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMinutesChange(Math.max(0, minutes - 1))}
                disabled={minutes === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => onMinutesChange(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="text-center font-mono text-lg"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMinutesChange(Math.min(59, minutes + 1))}
                disabled={minutes === 59}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Seconds Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Seconds</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSecondsChange(Math.max(0, seconds - 1))}
                disabled={seconds === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => onSecondsChange(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="text-center font-mono text-lg"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSecondsChange(Math.min(59, seconds + 1))}
                disabled={seconds === 59}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Control Buttons */}
      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <Button
            onClick={onStart}
            disabled={minutes === 0 && seconds === 0}
            variant="gradient"
            className="hover:scale-105 transition-transform px-8 py-3 text-lg font-semibold"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Timer
          </Button>
        ) : (
          <Button
            onClick={onPause}
            variant="secondary"
            className="hover:scale-105 transition-transform px-8 py-3 text-lg font-semibold"
          >
            <Pause className="h-5 w-5 mr-2" />
            Pause
          </Button>
        )}
        
        <Button
          onClick={onReset}
          variant="outline"
          className="hover:scale-105 transition-transform px-6 py-3"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Time Presets */}
      {!isRunning && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Quick Presets</label>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onMinutesChange(1);
                onSecondsChange(0);
              }}
            >
              1m
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onMinutesChange(5);
                onSecondsChange(0);
              }}
            >
              5m
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onMinutesChange(10);
                onSecondsChange(0);
              }}
            >
              10m
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onMinutesChange(25);
                onSecondsChange(0);
              }}
            >
              25m
            </Button>
          </div>
        </div>
      )}

      {/* Timer Status */}
      {isFinished && (
        <div className="text-center">
          <div className="text-2xl font-bold text-accent animate-pulse">
            ⏰ Time's Up!
          </div>
        </div>
      )}
    </div>
  );
};