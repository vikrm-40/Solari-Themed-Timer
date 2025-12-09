import { SplitFlapDigit } from './SplitFlapDigit';

interface SplitFlapDisplayProps {
  minutes: number;
  seconds: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
}

export const SplitFlapDisplay = ({ minutes, seconds, size = 'lg', variant = 'light' }: SplitFlapDisplayProps) => {
  const minuteTens = Math.floor(minutes / 10);
  const minuteOnes = minutes % 10;
  const secondTens = Math.floor(seconds / 10);
  const secondOnes = seconds % 10;

  const separatorSize = {
    sm: 'text-2xl',
    md: 'text-3xl', 
    lg: 'text-5xl',
    xl: 'text-7xl'
  };

  const dotSize = {
    sm: 'h-2 w-2 mb-2',
    md: 'h-2 w-2 mb-2',
    lg: 'h-2 w-2 mb-2',
    xl: 'h-3 w-3 mb-3'
  };

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {/* Minutes */}
      <div className="flex gap-1">
        <SplitFlapDigit value={minuteTens} size={size} variant={variant} />
        <SplitFlapDigit value={minuteOnes} size={size} variant={variant} />
      </div>
      
      {/* Separator */}
      <div className={`flex flex-col justify-center ${separatorSize[size]} font-mono font-bold text-accent animate-pulse`}>
        <div className={`${dotSize[size]} bg-accent rounded-full`}></div>
        <div className={`${dotSize[size]} bg-accent rounded-full`}></div>
      </div>
      
      {/* Seconds */}
      <div className="flex gap-1">
        <SplitFlapDigit value={secondTens} size={size} variant={variant} />
        <SplitFlapDigit value={secondOnes} size={size} variant={variant} />
      </div>
    </div>
  );
};