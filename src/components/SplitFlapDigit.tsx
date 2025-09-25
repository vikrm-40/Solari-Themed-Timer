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

  const halfHeight = sizeClasses[size].includes('h-16') ? 32 : sizeClasses[size].includes('h-20') ? 40 : 56;

  return (
    <div className="relative" style={{ perspective: '1000px' }}>
      <div className={`relative ${sizeClasses[size]} rounded-md overflow-hidden bg-gradient-to-b from-gray-100 to-white border-2 border-gray-300 shadow-lg`} style={{ boxShadow: '0 8px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1)' }}>
        {/* Top half - shows current digit normally, next digit when flipping */}
        <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
          <div 
            className={`${sizeClasses[size]} flex items-center justify-center font-mono font-bold text-black`}
            style={{ 
              height: `${halfHeight * 2}px`,
              marginTop: '0',
              clipPath: 'inset(0 0 50% 0)'
            }}
          >
            {isFlipping && flipAngle >= 90 ? nextDigit : currentDigit}
          </div>
        </div>

        {/* Bottom half - shows current digit normally, next digit when flipping */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden bg-gradient-to-t from-gray-200 to-gray-100" style={{ boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)' }}>
          <div 
            className={`${sizeClasses[size]} flex items-center justify-center font-mono font-bold text-black`}
            style={{ 
              height: `${halfHeight * 2}px`,
              marginTop: `-${halfHeight}px`,
              clipPath: 'inset(50% 0 0 0)'
            }}
          >
            {isFlipping && flipAngle >= 90 ? nextDigit : currentDigit}
          </div>
        </div>

        {/* Flipping top half */}
        {isFlipping && (
          <div
            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden z-10 bg-gradient-to-b from-gray-50 to-gray-100"
            style={{ 
              transformStyle: 'preserve-3d', 
              transformOrigin: 'bottom center',
              transform: `rotateX(${flipAngle}deg)`,
              transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              backfaceVisibility: 'hidden',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div 
              className={`${sizeClasses[size]} flex items-center justify-center font-mono font-bold text-black`}
              style={{ 
                height: `${halfHeight * 2}px`,
                marginTop: '0',
                clipPath: 'inset(0 0 50% 0)'
              }}
            >
              {currentDigit}
            </div>
          </div>
        )}

        {/* Divider line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 z-20" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  );
};