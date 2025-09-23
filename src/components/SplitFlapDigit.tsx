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
  const [phase, setPhase] = useState<'idle' | 'top' | 'bottom'>('idle');
  const [showTopFlap, setShowTopFlap] = useState(false);
  const [showBottomFlap, setShowBottomFlap] = useState(false);
  const [topAngle, setTopAngle] = useState(0); // 0 -> -90
  const [bottomAngle, setBottomAngle] = useState(90); // 90 -> 0

  const topTimeoutRef = useRef<number | null>(null);
  const bottomTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (topTimeoutRef.current) window.clearTimeout(topTimeoutRef.current);
      if (bottomTimeoutRef.current) window.clearTimeout(bottomTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (value === displayValue) return;

    // Phase 1: Top flap closes (current digit)
    setPhase('top');
    setShowTopFlap(true);
    setTopAngle(0);
    requestAnimationFrame(() => {
      setTopAngle(-90);
    });

    topTimeoutRef.current = window.setTimeout(() => {
      // Switch the displayed value as the flap reaches 90deg
      setDisplayValue(value);
      setShowTopFlap(false);

      // Phase 2: Bottom flap opens (next digit)
      setPhase('bottom');
      setShowBottomFlap(true);
      setBottomAngle(90);
      requestAnimationFrame(() => {
        setBottomAngle(0);
      });

      bottomTimeoutRef.current = window.setTimeout(() => {
        setShowBottomFlap(false);
        setPhase('idle');
      }, 250);
    }, 250);
  }, [value, displayValue]);

  const currentDigit = String(displayValue).padStart(2, '0').slice(-1);
  const nextDigit = String(value).padStart(2, '0').slice(-1);

  const topStaticDigit = phase === 'idle' ? currentDigit : nextDigit;
  const bottomStaticDigit = phase === 'top' ? currentDigit : nextDigit;

  return (
    <div className="relative" style={{ perspective: '1000px' }}>
      <div className={`relative ${sizeClasses[size]} rounded-md overflow-hidden bg-card border border-border/30 shadow-sm`}>
        {/* Top static half (revealed under the rotating flap) */}
        <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-card">
          <div className={`${sizeClasses[size]} h-full flex items-end justify-center font-mono font-bold text-foreground`}>
            {topStaticDigit}
          </div>
        </div>

        {/* Bottom static half */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden bg-card">
          <div className={`${sizeClasses[size]} h-full flex items-start justify-center font-mono font-bold text-foreground`}>
            {bottomStaticDigit}
          </div>
        </div>

        {/* Rotating TOP flap (current digit) */}
        {showTopFlap && (
          <div
            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden z-10"
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'bottom center' }}
          >
            <div
              className={`${sizeClasses[size]} h-full flex items-end justify-center font-mono font-bold text-foreground bg-card`}
              style={{
                backfaceVisibility: 'hidden',
                transform: `rotateX(${topAngle}deg)`,
                transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {currentDigit}
            </div>
          </div>
        )}

        {/* Rotating BOTTOM flap (next digit) */}
        {showBottomFlap && (
          <div
            className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden z-10"
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'top center' }}
          >
            <div
              className={`${sizeClasses[size]} h-full flex items-start justify-center font-mono font-bold text-foreground bg-card`}
              style={{
                backfaceVisibility: 'hidden',
                transform: `rotateX(${bottomAngle}deg)`,
                transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {nextDigit}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-border/50 z-20" />
      </div>
    </div>
  );
};