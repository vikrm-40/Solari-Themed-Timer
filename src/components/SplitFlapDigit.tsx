import { useState, useEffect, useRef } from 'react';

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
  const [flipAngle, setFlipAngle] = useState(0);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (value === displayValue) return;

    // Start the flip animation
    setIsFlipping(true);
    setFlipAngle(0);
    
    requestAnimationFrame(() => {
      setFlipAngle(180);
    });

    // At halfway point (90 degrees), update the display value
    timeoutRef.current = window.setTimeout(() => {
      setDisplayValue(value);
    }, 125); // Half of the 250ms animation

    // Complete the animation
    setTimeout(() => {
      setIsFlipping(false);
      setFlipAngle(0);
    }, 250);
  }, [value, displayValue]);

  const currentDigit = String(displayValue).padStart(2, '0').slice(-1);
  const nextDigit = String(value).padStart(2, '0').slice(-1);

  return (
    <div className="relative" style={{ perspective: '1000px' }}>
      <div className={`relative ${sizeClasses[size]} rounded-md overflow-hidden bg-card border border-border/30 shadow-sm`}>
        {/* Top static half - shows next digit (revealed when flipping) */}
        <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-card">
          <div className={`${sizeClasses[size]} flex items-center justify-center font-mono font-bold text-foreground`} 
               style={{ height: `${sizeClasses[size].includes('h-16') ? '32px' : sizeClasses[size].includes('h-20') ? '40px' : '56px'}`, 
                        marginTop: '0' }}>
            {nextDigit}
          </div>
        </div>

        {/* Bottom static half - shows current digit */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden bg-card">
          <div className={`${sizeClasses[size]} flex items-center justify-center font-mono font-bold text-foreground`}
               style={{ height: `${sizeClasses[size].includes('h-16') ? '32px' : sizeClasses[size].includes('h-20') ? '40px' : '56px'}`, 
                        marginTop: `${sizeClasses[size].includes('h-16') ? '-32px' : sizeClasses[size].includes('h-20') ? '-40px' : '-56px'}` }}>
            {currentDigit}
          </div>
        </div>

        {/* Rotating flap - shows current digit top half and flips down */}
        {isFlipping && (
          <div
            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden z-10"
            style={{ 
              transformStyle: 'preserve-3d', 
              transformOrigin: 'bottom center',
              transform: `rotateX(${flipAngle}deg)`,
              transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className={`${sizeClasses[size]} flex items-center justify-center font-mono font-bold text-foreground bg-card`}
                 style={{ height: `${sizeClasses[size].includes('h-16') ? '32px' : sizeClasses[size].includes('h-20') ? '40px' : '56px'}`, 
                          marginTop: '0' }}>
              {currentDigit}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-border/50 z-20" />
      </div>
    </div>
  );
};