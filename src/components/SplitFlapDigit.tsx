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
      
      // Update display value after the flip animation completes
      setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 500);
    }
  }, [value, displayValue]);

  const currentDigit = String(displayValue).padStart(2, '0').slice(-1);
  const nextDigit = String(value).padStart(2, '0').slice(-1);

  return (
    <div className="relative perspective-1000">
      <div className={`relative ${sizeClasses[size]} rounded-lg overflow-hidden bg-card border border-border/20 shadow-lg`}>
        
        {/* Static bottom half - always shows current number */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden bg-card">
          <div 
            className={`absolute inset-0 ${sizeClasses[size]} flex items-start justify-center pt-0 font-mono font-bold text-foreground`}
            style={{ transform: 'translateY(-100%)' }}
          >
            {isFlipping ? nextDigit : currentDigit}
          </div>
        </div>

        {/* Static top half - shows current number when not flipping */}
        {!isFlipping && (
          <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-card">
            <div className={`${sizeClasses[size]} flex items-end justify-center pb-0 font-mono font-bold text-foreground`}>
              {currentDigit}
            </div>
          </div>
        )}

        {/* Animated top flap - rotates down during flip */}
        {isFlipping && (
          <>
            {/* New number revealed underneath */}
            <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-card">
              <div className={`${sizeClasses[size]} flex items-end justify-center pb-0 font-mono font-bold text-foreground`}>
                {nextDigit}
              </div>
            </div>
            
            {/* Rotating flap with old number */}
            <div 
              className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-card animate-flip-top z-10"
              style={{ 
                transformStyle: 'preserve-3d',
                transformOrigin: 'bottom center'
              }}
            >
              <div className={`${sizeClasses[size]} flex items-end justify-center pb-0 font-mono font-bold text-foreground`}>
                {currentDigit}
              </div>
            </div>
          </>
        )}
        
        {/* Center divider line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border/30 z-20 transform -translate-y-px" />
        
        {/* Subtle highlight for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-5" />
      </div>
    </div>
  );
};