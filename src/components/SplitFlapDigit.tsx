import { useState, useEffect, useRef } from 'react';

interface SplitFlapDigitProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const sizeClasses = {
  sm: 'w-12 h-16 text-2xl',
  md: 'w-16 h-20 text-3xl',
  lg: 'w-20 h-28 text-5xl'
};

export const SplitFlapDigit = ({ value, size = 'lg', variant = 'light' }: SplitFlapDigitProps) => {
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
    }, 200); // Half of the 400ms animation

    // Complete the animation
    setTimeout(() => {
      setIsFlipping(false);
      setFlipAngle(0);
    }, 400);
  }, [value, displayValue]);

  const currentDigit = String(displayValue).padStart(2, '0').slice(-1);
  const nextDigit = String(value).padStart(2, '0').slice(-1);

  const halfHeight = sizeClasses[size].includes('h-16') ? 32 : sizeClasses[size].includes('h-20') ? 40 : 56;
  
  // Theme-specific styles
  const themeStyles = {
    light: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #f1f3f4 100%)',
      topHalf: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 50%, #f1f3f4 100%)',
      bottomHalf: 'linear-gradient(0deg, #f1f3f4 0%, #f8f9fa 50%, #ffffff 100%)',
      textColor: '#111827', // gray-900
      boxShadow: `
        0 4px 16px rgba(0,0,0,0.08),
        0 2px 8px rgba(0,0,0,0.04),
        inset 0 1px 0 rgba(255,255,255,0.8),
        inset 0 -1px 0 rgba(0,0,0,0.05)
      `,
      border: '0.5px solid rgba(0,0,0,0.08)',
      dividerLine: 'rgba(0,0,0,0.08)',
      highlightLine: 'rgba(255,255,255,0.4)'
    },
    dark: {
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)',
      topHalf: 'linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)',
      bottomHalf: 'linear-gradient(0deg, #2a2a2a 0%, #1a1a1a 50%, #000000 100%)',
      textColor: '#fbbf24', // yellow-400
      boxShadow: `
        0 4px 16px rgba(0,0,0,0.3),
        0 2px 8px rgba(0,0,0,0.2),
        inset 0 1px 0 rgba(255,255,255,0.1),
        inset 0 -1px 0 rgba(0,0,0,0.3)
      `,
      border: '0.5px solid rgba(255,255,255,0.1)',
      dividerLine: 'rgba(255,255,255,0.15)',
      highlightLine: 'rgba(251,191,36,0.2)'
    }
  };
  
  const currentTheme = themeStyles[variant];

  return (
    <div className="relative" style={{ perspective: '800px' }}>
      <div 
        className={`relative ${sizeClasses[size]} rounded-lg overflow-hidden`}
        style={{ 
          background: currentTheme.background,
          boxShadow: currentTheme.boxShadow,
          border: currentTheme.border,
          transform: 'rotateX(1deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Top half - shows current digit normally, next digit when flipping */}
        <div 
          className="absolute top-0 left-0 w-full h-1/2 overflow-hidden"
          style={{ 
            background: currentTheme.topHalf,
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
          }}
        >
          <div 
            className={`${sizeClasses[size]} flex items-center justify-center font-semibold`}
            style={{ 
              height: `${halfHeight * 2}px`,
              marginTop: '0',
              clipPath: 'inset(0 0 50% 0)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              letterSpacing: '0.02em',
              color: currentTheme.textColor
            }}
          >
            {isFlipping && flipAngle >= 90 ? nextDigit : currentDigit}
          </div>
        </div>

        {/* Bottom half - shows current digit normally, next digit when flipping */}
        <div 
          className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden"
          style={{ 
            background: currentTheme.bottomHalf,
            boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.04)'
          }}
        >
          <div 
            className={`${sizeClasses[size]} flex items-center justify-center font-semibold`}
            style={{ 
              height: `${halfHeight * 2}px`,
              marginTop: `-${halfHeight}px`,
              clipPath: 'inset(50% 0 0 0)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              letterSpacing: '0.02em',
              filter: 'brightness(0.95)',
              color: currentTheme.textColor
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
              background: currentTheme.topHalf,
              transformStyle: 'preserve-3d', 
              transformOrigin: 'bottom center',
              transform: `rotateX(${flipAngle}deg)`,
              transition: 'transform 400ms cubic-bezier(0.25, 0.1, 0.25, 1)',
              backfaceVisibility: 'hidden',
              boxShadow: `
                0 4px 12px rgba(0,0,0,0.1),
                0 2px 6px rgba(0,0,0,0.06),
                inset 0 1px 2px rgba(0,0,0,0.04)
              `,
              filter: `brightness(${0.95 + Math.cos((flipAngle * Math.PI) / 180) * 0.1})`
            }}
          >
            <div 
              className={`${sizeClasses[size]} flex items-center justify-center font-semibold`}
              style={{ 
                height: `${halfHeight * 2}px`,
                marginTop: '0',
                clipPath: 'inset(0 0 50% 0)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                letterSpacing: '0.02em',
                color: currentTheme.textColor
              }}
            >
              {currentDigit}
            </div>
          </div>
        )}

        {/* Clean divider line - Apple style */}
        <div 
          className="absolute top-1/2 left-0 w-full z-20" 
          style={{ 
            height: '0.5px',
            background: currentTheme.dividerLine,
            boxShadow: '0 0.5px 0 rgba(255,255,255,0.6)',
            transform: 'translateY(-0.25px)'
          }} 
        />
        
        {/* Subtle highlight line */}
        <div 
          className="absolute top-1/2 left-0 w-full z-19" 
          style={{ 
            height: '0.5px',
            background: currentTheme.highlightLine,
            transform: 'translateY(0.25px)'
          }} 
        />
      </div>
    </div>
  );
};