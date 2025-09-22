import { useState, useEffect } from 'react';

interface SplitFlapDigitProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-12 h-16 text-2xl',
  md: 'w-16 h-20 text-3xl',
  lg: 'w-20 h-28 text-5xl'
};

export const SplitFlapDigit = ({ value, size = 'lg' }: SplitFlapDigitProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);
      
      // Change the display value halfway through the animation
      setTimeout(() => {
        setDisplayValue(value);
      }, 300); // Half of the 600ms animation
      
      // Reset animation state
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }
  }, [value, displayValue]);

  return (
    <div className="relative perspective-1000">
      {/* Background card with glass effect */}
      <div className={`split-flap glass-card ${sizeClasses[size]} rounded-lg`}>
        {/* Top half */}
        <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden">
          <div className={`split-flap-digit ${sizeClasses[size]} ${isFlipping ? 'animate-flip-up' : ''}`}>
            {String(displayValue).padStart(2, '0').slice(-1)}
          </div>
        </div>
        
        {/* Bottom half */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden">
          <div 
            className={`split-flap-digit ${sizeClasses[size]} ${isFlipping ? 'animate-flip-down' : ''}`}
            style={{ transform: 'translateY(-50%)' }}
          >
            {String(displayValue).padStart(2, '0').slice(-1)}
          </div>
        </div>
        
        {/* Middle divider line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-border opacity-50 z-10" />
        
        {/* Highlight overlay for glass effect */}
        <div className="absolute inset-0 gradient-glass rounded-lg pointer-events-none" />
      </div>
      
      {/* Glow effect when flipping */}
      {isFlipping && (
        <div className="absolute inset-0 rounded-lg animate-glow pointer-events-none" />
      )}
    </div>
  );
};