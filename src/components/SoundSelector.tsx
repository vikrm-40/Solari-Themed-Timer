import { Volume2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

export type SoundOption = 'bell' | 'chime' | 'beep' | 'gong' | 'none';

interface SoundSelectorProps {
  selectedSound: SoundOption;
  volume: number;
  onSoundChange: (sound: SoundOption) => void;
  onVolumeChange: (volume: number) => void;
}

// Generate different frequency beeps for each sound option
const generateBeep = (frequency: number, duration: number = 0.2): string => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  return frequency.toString(); // Return frequency as identifier
};

const sounds: { id: SoundOption; label: string; frequency: number }[] = [
  { id: 'bell', label: 'Bell', frequency: 800 },
  { id: 'chime', label: 'Chime', frequency: 1200 },
  { id: 'beep', label: 'Beep', frequency: 440 },
  { id: 'gong', label: 'Gong', frequency: 200 },
  { id: 'none', label: 'No Sound', frequency: 0 }
];

export const SoundSelector = ({ selectedSound, volume, onSoundChange, onVolumeChange }: SoundSelectorProps) => {
  const playSound = (frequency: number) => {
    if (frequency === 0) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      const duration = 0.3;
      gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-3 block">Completion Sound</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {sounds.map((sound) => (
            <Button
              key={sound.id}
              variant={selectedSound === sound.id ? 'default' : 'outline'}
              size="sm"
              className="relative justify-start"
              onClick={() => {
                onSoundChange(sound.id);
                playSound(sound.frequency);
              }}
            >
              {selectedSound === sound.id && (
                <Check className="w-4 h-4 mr-2" />
              )}
              {sound.label}
            </Button>
          ))}
        </div>
      </div>

      {selectedSound !== 'none' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Volume</Label>
            <span className="text-sm text-muted-foreground">{Math.round(volume * 100)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              onValueChange={(values) => onVolumeChange(values[0])}
              max={1}
              step={0.1}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};
