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
      
      // Change the display value when the top flap covers the bottom
      setTimeout(() => {
        setDisplayValue(value);
      }, 250); // When top flap reaches 90 degrees
      
      // Reset animation state
      setTimeout(() => {
        setIsFlipping(false);
      }, 500);
    }
  }, [value, displayValue]);

  return (
    <div className="relative perspective-1000">
      {/* Background card with glass effect */}
      <div className={`split-flap glass-card ${sizeClasses[size]} rounded-lg overflow-hidden`}>
        {/* Bottom half - static background showing current number */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden">
          <div 
            className={`split-flap-digit ${sizeClasses[size]} flex items-center justify-center`}
            style={{ transform: 'translateY(-50%)' }}
          >
            {String(displayValue).padStart(2, '0').slice(-1)}
          </div>
        </div>
        
        {/* New number showing underneath (revealed when top flips) */}
        <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden">
          <div className={`split-flap-digit ${sizeClasses[size]} flex items-center justify-center ${isFlipping ? 'animate-flip-reveal' : ''}`}>
            {String(value).padStart(2, '0').slice(-1)}
          </div>
        </div>
        
        {/* Top half - the flipping part */}
        <div className={`absolute top-0 left-0 w-full h-1/2 overflow-hidden ${isFlipping ? 'animate-flip-top' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
          <div className={`split-flap-digit ${sizeClasses[size]} flex items-center justify-center bg-card`}>
            {String(displayValue).padStart(2, '0').slice(-1)}
          </div>
        </div>
        
        {/* Middle divider line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-border opacity-50 z-20" />
        
        {/* Highlight overlay for glass effect */}
        <div className="absolute inset-0 gradient-glass rounded-lg pointer-events-none z-10" />
      </div>
      
      {/* Glow effect when flipping */}
      {isFlipping && (
        <div className="absolute inset-0 rounded-lg animate-glow pointer-events-none" />
      )}
    </div>
  );
};