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
  const [nextValue, setNextValue] = useState(value);

  useEffect(() => {
    if (value !== displayValue) {
      setNextValue(value);
      setIsFlipping(true);
      
      // Play authentic Solari sound effect
      try {
        // Create a more authentic mechanical flip sound
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create the mechanical "click-clack" sound
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
      } catch (error) {
        // Fallback to simpler sound if Web Audio API fails
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIgBSyRzO/Hl0ENHJGQ2OWuUhEWXMDn85xZAQ=');
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch {}
      }
      
      // Change the display value when the flap is halfway
      setTimeout(() => {
        setDisplayValue(value);
      }, 250);
      
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
        {/* Bottom half - shows the current number */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden bg-card">
          <div 
            className={`split-flap-digit ${sizeClasses[size]} flex items-center justify-center`}
            style={{ transform: 'translateY(-50%)' }}
          >
            {String(displayValue).padStart(2, '0').slice(-1)}
          </div>
        </div>
        
        {/* Top half static - shows current number until flip starts */}
        <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-card">
          <div className={`split-flap-digit ${sizeClasses[size]} flex items-center justify-center`}>
            {String(displayValue).padStart(2, '0').slice(-1)}
          </div>
        </div>
        
        {/* New number revealed underneath (only visible during flip) */}
        {isFlipping && (
          <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-card z-5">
            <div className={`split-flap-digit ${sizeClasses[size]} flex items-center justify-center animate-flip-reveal`}>
              {String(nextValue).padStart(2, '0').slice(-1)}
            </div>
          </div>
        )}
        
        {/* Flipping top half */}
        {isFlipping && (
          <div 
            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden animate-flip-top z-15 bg-card"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={`split-flap-digit ${sizeClasses[size]} flex items-center justify-center`}>
              {String(displayValue).padStart(2, '0').slice(-1)}
            </div>
          </div>
        )}
        
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