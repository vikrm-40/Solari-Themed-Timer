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

const sounds: { id: SoundOption; label: string; audio: string }[] = [
  { 
    id: 'bell', 
    label: 'Bell', 
    audio: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIgBSyRzO/Hl0ENHJGQ2OWuUhEWXMDn85xZAQ=='
  },
  { 
    id: 'chime', 
    label: 'Chime', 
    audio: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAhImHcGFjdpiuq49hODZhoNDaqmQdCECZ2vDCdCcILH/N8NaLOQsaabrq5p9PEw5Ppt/us2YgCTiP1e3LfC8JJXbF7tuSQwwVXLHn6adXFgtFnN3wvGQiByyPyu3GmUMQHY6N1eKuUxMYWr3l8ZpaBA=='
  },
  { 
    id: 'beep', 
    label: 'Beep', 
    audio: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA=='
  },
  { 
    id: 'gong', 
    label: 'Gong', 
    audio: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACDh42LZltmfqKzrI1eNTRensnXpmAYBDyX2O++cSQDKnzK792HNgYXZrjo459MEAtOpd7rr2IaAzaO1OzJeSsEI3TC7NqPPggTW67k5aVUEglEnNvuumEfBCuNx+vFlD8PHouP0t+sTxEUWLrj75hYAw=='
  },
  { 
    id: 'none', 
    label: 'No Sound', 
    audio: ''
  }
];

export const SoundSelector = ({ selectedSound, volume, onSoundChange, onVolumeChange }: SoundSelectorProps) => {
  const playSound = (audioData: string) => {
    if (!audioData) return;
    try {
      const audio = new Audio(audioData);
      audio.volume = volume;
      audio.play().catch(() => {});
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
                playSound(sound.audio);
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
