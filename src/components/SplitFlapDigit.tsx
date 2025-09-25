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
    }, 175); // Half of the 350ms animation

    // Complete the animation
    setTimeout(() => {
      setIsFlipping(false);
      setFlipAngle(0);
    }, 350);
  }, [value, displayValue]);

  const currentDigit = String(displayValue).padStart(2, '0').slice(-1);
  const nextDigit = String(value).padStart(2, '0').slice(-1);

  const halfHeight = sizeClasses[size].includes('h-16') ? 32 : sizeClasses[size].includes('h-20') ? 40 : 56;

  return (
    <div className="relative" style={{ perspective: '1200px' }}>
      <div 
        className={`relative ${sizeClasses[size]} rounded-sm overflow-hidden`}
        style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #000000 100%)',
          boxShadow: `
            0 12px 24px rgba(0,0,0,0.6),
            0 6px 12px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.8),
            inset 1px 0 0 rgba(255,255,255,0.05),
            inset -1px 0 0 rgba(0,0,0,0.5)
          `,
          border: '1px solid #333',
          transform: 'rotateX(2deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Top half - shows current digit normally, next digit when flipping */}
        <div 
          className="absolute top-0 left-0 w-full h-1/2 overflow-hidden"
          style={{ 
            background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0d0d0d 100%)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
          }}
        >
          <div 
            className={`${sizeClasses[size]} flex items-center justify-center font-mono font-bold text-white`}
            style={{ 
              height: `${halfHeight * 2}px`,
              marginTop: '0',
              clipPath: 'inset(0 0 50% 0)',
              textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(255,255,255,0.1)',
              filter: 'brightness(1.1)'
            }}
          >
            {isFlipping && flipAngle >= 90 ? nextDigit : currentDigit}
          </div>
        </div>

        {/* Bottom half - shows current digit normally, next digit when flipping */}
        <div 
          className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden"
          style={{ 
            background: 'linear-gradient(0deg, #000000 0%, #0d0d0d 50%, #1a1a1a 100%)',
            boxShadow: 'inset 0 -2px 8px rgba(0,0,0,0.8), inset 0 -1px 0 rgba(255,255,255,0.05)'
          }}
        >
          <div 
            className={`${sizeClasses[size]} flex items-center justify-center font-mono font-bold text-white`}
            style={{ 
              height: `${halfHeight * 2}px`,
              marginTop: `-${halfHeight}px`,
              clipPath: 'inset(50% 0 0 0)',
              textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(255,255,255,0.1)',
              filter: 'brightness(0.9)'
            }}
          >
            {isFlipping && flipAngle >= 90 ? nextDigit : currentDigit}
          </div>
        </div>

        {/* Flipping top half */}
        {isFlipping && (
          <div
            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden z-10"
            style={{ 
              background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0d0d0d 100%)',
              transformStyle: 'preserve-3d', 
              transformOrigin: 'bottom center',
              transform: `rotateX(${flipAngle}deg)`,
              transition: 'transform 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              backfaceVisibility: 'hidden',
              boxShadow: `
                0 8px 16px rgba(0,0,0,0.8),
                0 4px 8px rgba(0,0,0,0.6),
                inset 0 2px 8px rgba(0,0,0,0.6),
                inset 0 1px 0 rgba(255,255,255,0.08)
              `,
              filter: `brightness(${1 + Math.cos((flipAngle * Math.PI) / 180) * 0.3})`
            }}
          >
            <div 
              className={`${sizeClasses[size]} flex items-center justify-center font-mono font-bold text-white`}
              style={{ 
                height: `${halfHeight * 2}px`,
                marginTop: '0',
                clipPath: 'inset(0 0 50% 0)',
                textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(255,255,255,0.1)',
                filter: 'brightness(1.1)'
              }}
            >
              {currentDigit}
            </div>
          </div>
        )}

        {/* Mechanical divider line with realistic depth */}
        <div 
          className="absolute top-1/2 left-0 w-full z-20" 
          style={{ 
            height: '2px',
            background: 'linear-gradient(90deg, #444 0%, #666 20%, #333 50%, #666 80%, #444 100%)',
            boxShadow: `
              0 1px 0 rgba(255,255,255,0.1),
              0 -1px 0 rgba(0,0,0,0.8),
              inset 0 1px 0 rgba(0,0,0,0.9),
              0 2px 4px rgba(0,0,0,0.6)
            `,
            transform: 'translateY(-1px)'
          }} 
        />
        
        {/* Additional depth indicator */}
        <div 
          className="absolute top-1/2 left-0 w-full z-19" 
          style={{ 
            height: '1px',
            background: 'rgba(255,255,255,0.05)',
            transform: 'translateY(1px)'
          }} 
        />
      </div>
    </div>
  );
};