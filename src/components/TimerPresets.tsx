import { Button } from './ui/button';
import { Clock, Coffee, Focus, Zap } from 'lucide-react';

interface TimerPresetsProps {
  onPresetSelect: (minutes: number, seconds: number) => void;
  disabled?: boolean;
}

const presets = [
  { name: 'Pomodoro', minutes: 25, seconds: 0, icon: Coffee, color: 'text-red-400' },
  { name: 'Short Break', minutes: 5, seconds: 0, icon: Zap, color: 'text-green-400' },
  { name: 'Long Break', minutes: 15, seconds: 0, icon: Clock, color: 'text-blue-400' },
  { name: 'Focus', minutes: 60, seconds: 0, icon: Focus, color: 'text-purple-400' },
];

export const TimerPresets = ({ onPresetSelect, disabled = false }: TimerPresetsProps) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {presets.map((preset) => {
        const Icon = preset.icon;
        return (
          <Button
            key={preset.name}
            onClick={() => onPresetSelect(preset.minutes, preset.seconds)}
            disabled={disabled}
            variant="outline"
            className="preset-button h-auto py-2 px-2 flex flex-col items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Icon className={`h-4 w-4 ${preset.color}`} />
            <span className="text-[10px] font-bold tracking-wider">{preset.name}</span>
            <span className="text-[9px] text-muted-foreground font-normal">
              {preset.minutes}:{preset.seconds.toString().padStart(2, '0')}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
