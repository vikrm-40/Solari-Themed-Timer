import { SplitFlapDigit } from './SplitFlapDigit';

interface SplitFlapDisplayProps {
  minutes: number;
  seconds: number;
  size?: 'sm' | 'md' | 'lg';
}

export const SplitFlapDisplay = ({ minutes, seconds, size = 'lg' }: SplitFlapDisplayProps) => {
  const minuteTens = Math.floor(minutes / 10);
  const minuteOnes = minutes % 10;
  const secondTens = Math.floor(seconds / 10);
  const secondOnes = seconds % 10;

  const separatorSize = {
    sm: 'text-2xl',
    md: 'text-3xl', 
    lg: 'text-5xl'
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <SplitFlapDigit value={minuteTens} size={size} />
      <SplitFlapDigit value={minuteOnes} size={size} />
      <SplitFlapDigit value={secondTens} size={size} />
      <SplitFlapDigit value={secondOnes} size={size} />
    </div>
  );
};