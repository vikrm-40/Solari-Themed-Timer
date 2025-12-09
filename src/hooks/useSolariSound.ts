import { useCallback, useRef } from 'react';

export const useSolariSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Authentic Solari split-flap mechanical click sound
  const playFlipSound = useCallback(() => {
    try {
      const audioContext = getAudioContext();
      const currentTime = audioContext.currentTime;

      // Create noise for mechanical click
      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.08, audioContext.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < noiseData.length; i++) {
        // Initial sharp click followed by decay
        const envelope = i < noiseData.length * 0.1 
          ? Math.pow(i / (noiseData.length * 0.1), 0.5)
          : Math.exp(-((i - noiseData.length * 0.1) / (noiseData.length * 0.3)) * 3);
        noiseData[i] = (Math.random() * 2 - 1) * envelope * 0.6;
      }

      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Low-pass filter for that plastic/metal flap sound
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2500;
      filter.Q.value = 1.5;

      // High-pass to remove rumble
      const highPass = audioContext.createBiquadFilter();
      highPass.type = 'highpass';
      highPass.frequency.value = 800;

      // Add a bit of resonance for mechanical feel
      const resonator = audioContext.createBiquadFilter();
      resonator.type = 'peaking';
      resonator.frequency.value = 1800;
      resonator.Q.value = 3;
      resonator.gain.value = 6;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.15;

      noiseSource.connect(filter);
      filter.connect(highPass);
      highPass.connect(resonator);
      resonator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      noiseSource.start(currentTime);
      noiseSource.stop(currentTime + 0.08);

      // Add a subtle low thump for the mechanical stop
      const thumpOsc = audioContext.createOscillator();
      const thumpGain = audioContext.createGain();
      thumpOsc.type = 'sine';
      thumpOsc.frequency.value = 150;
      thumpGain.gain.setValueAtTime(0.08, currentTime + 0.03);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.08);
      
      thumpOsc.connect(thumpGain);
      thumpGain.connect(audioContext.destination);
      
      thumpOsc.start(currentTime + 0.03);
      thumpOsc.stop(currentTime + 0.08);

    } catch (error) {
      console.error('Error playing flip sound:', error);
    }
  }, [getAudioContext]);

  // Classic train station Solari board cascade sound (multiple flaps)
  const playCascadeSound = useCallback((count: number = 3) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => playFlipSound(), i * 50);
    }
  }, [playFlipSound]);

  return {
    playFlipSound,
    playCascadeSound
  };
};
