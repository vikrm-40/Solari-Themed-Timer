import { SplitFlapDisplay } from '@/components/SplitFlapDisplay';
import { TimerControls } from '@/components/TimerControls';
import { useTimer } from '@/hooks/useTimer';

const Index = () => {
  const {
    minutes,
    seconds,
    isRunning,
    isFinished,
    start,
    pause,
    reset,
    setMinutes,
    setSeconds,
  } = useTimer(5, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
          Timer
        </h1>
      </div>

      {/* Main Timer Display */}
      <div className="mb-8">
        <SplitFlapDisplay 
          minutes={minutes} 
          seconds={seconds}
          size="lg"
        />
      </div>

      {/* Timer Controls */}
      <div className="w-full max-w-md">
        <TimerControls
          minutes={minutes}
          seconds={seconds}
          isRunning={isRunning}
          isFinished={isFinished}
          onMinutesChange={setMinutes}
          onSecondsChange={setSeconds}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />
      </div>

      {/* Navigation link to dark version */}
      <div className="mt-4">
        <a 
          href="/dark" 
          className="text-primary hover:text-primary/80 underline text-sm"
        >
          Switch to Dark Version
        </a>
      </div>
    </div>
  );
};

export default Index;
