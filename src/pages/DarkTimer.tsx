import { SplitFlapDisplay } from '@/components/SplitFlapDisplay';
import { TimerControls } from '@/components/TimerControls';
import { useTimer } from '@/hooks/useTimer';

const DarkTimer = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
          Timer
        </h1>
      </div>

      {/* Main Timer Display */}
      <div className="mb-8">
        <SplitFlapDisplay 
          minutes={minutes} 
          seconds={seconds}
          size="lg"
          variant="dark"
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

      {/* Navigation link to light version */}
      <div className="mt-4">
        <a 
          href="/" 
          className="text-yellow-400 hover:text-yellow-300 underline text-sm"
        >
          Switch to Light Version
        </a>
      </div>
    </div>
  );
};

export default DarkTimer;