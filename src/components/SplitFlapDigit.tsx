import { useState, useEffect, useRef } from 'react';

interface SplitFlapDigitProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
}

const sizeClasses = {
  sm: 'w-12 h-16 text-2xl',
  md: 'w-16 h-20 text-3xl',
  lg: 'w-20 h-28 text-5xl',
  xl: 'w-28 h-40 text-7xl'
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
    }, 325); // Half of the 650ms animation

    // Complete the animation
    setTimeout(() => {
      setIsFlipping(false);
      setFlipAngle(0);
    }, 650);
  }, [value, displayValue]);

  const currentDigit = String(displayValue).padStart(2, '0').slice(-1);
  const nextDigit = String(value).padStart(2, '0').slice(-1);

  const halfHeight = sizeClasses[size].includes('h-16') ? 32 : sizeClasses[size].includes('h-20') ? 40 : sizeClasses[size].includes('h-28') ? 56 : 80;
  
  // Theme-specific styles - Industrial Luxury
  const themeStyles = {
    light: {
      background: 'hsl(0, 0%, 11%)', // Deep matte charcoal
      topHalf: 'linear-gradient(180deg, hsl(0, 0%, 13%) 0%, hsl(0, 0%, 11%) 100%)',
      bottomHalf: 'linear-gradient(0deg, hsl(0, 0%, 9%) 0%, hsl(0, 0%, 11%) 100%)',
      textColor: 'hsl(0, 0%, 98%)',
      boxShadow: `
        0 8px 24px -8px rgba(0,0,0,0.6),
        inset 0 1px 2px rgba(255,255,255,0.05),
        inset 0 -1px 2px rgba(0,0,0,0.3)
      `,
      border: '1px solid hsl(0, 0%, 20%)',
      dividerLine: 'hsl(0, 0%, 35%)', // Gunmetal grey hinge
      highlightLine: 'rgba(255,255,255,0.03)'
    },
    dark: {
      background: 'hsl(0, 0%, 11%)', // Same for consistency
      topHalf: 'linear-gradient(180deg, hsl(0, 0%, 13%) 0%, hsl(0, 0%, 11%) 100%)',
      bottomHalf: 'linear-gradient(0deg, hsl(0, 0%, 9%) 0%, hsl(0, 0%, 11%) 100%)',
      textColor: 'hsl(0, 0%, 98%)',
      boxShadow: `
        0 8px 24px -8px rgba(0,0,0,0.6),
        inset 0 1px 2px rgba(255,255,255,0.05),
        inset 0 -1px 2px rgba(0,0,0,0.3)
      `,
      border: '1px solid hsl(0, 0%, 20%)',
      dividerLine: 'hsl(0, 0%, 35%)', // Gunmetal grey hinge
      highlightLine: 'rgba(255,255,255,0.03)'
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
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          <div 
            className={`${sizeClasses[size]} flex items-center justify-center font-bold`}
            style={{ 
              height: `${halfHeight * 2}px`,
              marginTop: '0',
              clipPath: 'inset(0 0 50% 0)',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '-0.02em',
              fontWeight: 800,
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
            boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.3)'
          }}
        >
          <div 
            className={`${sizeClasses[size]} flex items-center justify-center font-bold`}
            style={{ 
              height: `${halfHeight * 2}px`,
              marginTop: `-${halfHeight}px`,
              clipPath: 'inset(50% 0 0 0)',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '-0.02em',
              fontWeight: 800,
              filter: 'brightness(0.92)',
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
              animation: 'flap-bounce 700ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              backfaceVisibility: 'hidden',
              boxShadow: `
                0 6px 16px rgba(0,0,0,0.4),
                0 2px 8px rgba(0,0,0,0.2),
                inset 0 1px 2px rgba(0,0,0,0.3)
              `,
              filter: `brightness(${0.92 + Math.cos((flipAngle * Math.PI) / 180) * 0.12})`
            }}
          >
            <div 
              className={`${sizeClasses[size]} flex items-center justify-center font-bold`}
              style={{ 
                height: `${halfHeight * 2}px`,
                marginTop: '0',
                clipPath: 'inset(0 0 50% 0)',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '-0.02em',
                fontWeight: 800,
                color: currentTheme.textColor
              }}
            >
              {currentDigit}
            </div>
          </div>
        )}

        {/* Metallic hinge divider - Gunmetal grey */}
        <div 
          className="absolute top-1/2 left-0 w-full z-20" 
          style={{ 
            height: '2px',
            background: `linear-gradient(90deg, transparent 0%, ${currentTheme.dividerLine} 10%, ${currentTheme.dividerLine} 90%, transparent 100%)`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
            transform: 'translateY(-1px)'
          }} 
        />
        
        {/* Subtle highlight line for depth */}
        <div 
          className="absolute top-1/2 left-0 w-full z-19" 
          style={{ 
            height: '1px',
            background: `linear-gradient(90deg, transparent 0%, ${currentTheme.highlightLine} 20%, ${currentTheme.highlightLine} 80%, transparent 100%)`,
            transform: 'translateY(1px)'
          }} 
        />
      </div>
    </div>
  );
};
