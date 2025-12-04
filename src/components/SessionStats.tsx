import { useEffect, useState } from 'react';
import { TrendingUp, Target, Clock } from 'lucide-react';

interface SessionStatsProps {
  currentSessionTime?: number;
}

export const SessionStats = ({ currentSessionTime = 0 }: SessionStatsProps) => {
  const [totalTime, setTotalTime] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    // Load stats from localStorage
    const saved = localStorage.getItem('timer-stats');
    if (saved) {
      try {
        const stats = JSON.parse(saved);
        setTotalTime(stats.totalTime || 0);
        setSessionsCompleted(stats.sessionsCompleted || 0);
      } catch (e) {
        console.error('Failed to parse stats:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save current session time
    if (currentSessionTime > 0) {
      const saved = localStorage.getItem('timer-stats');
      let stats = { totalTime: 0, sessionsCompleted: 0 };
      if (saved) {
        try {
          stats = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse stats:', e);
        }
      }
      stats.totalTime = (stats.totalTime || 0) + currentSessionTime;
      stats.sessionsCompleted = (stats.sessionsCompleted || 0) + 1;
      localStorage.setItem('timer-stats', JSON.stringify(stats));
      setTotalTime(stats.totalTime);
      setSessionsCompleted(stats.sessionsCompleted);
    }
  }, [currentSessionTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="flex items-center gap-4">
      <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground whitespace-nowrap">
        Today's Stats
      </h3>
      <div className="flex items-center gap-4 flex-1 justify-around">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-mono">Focus</p>
            <p className="text-sm font-bold font-mono">{formatTime(totalTime)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20">
            <Target className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-mono">Sessions</p>
            <p className="text-sm font-bold font-mono">{sessionsCompleted}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 border border-accent/20">
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-mono">Streak</p>
            <p className="text-sm font-bold font-mono">{sessionsCompleted > 0 ? '1d' : '0d'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
