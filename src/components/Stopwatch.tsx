import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { playSound } from '../utils/audio';

interface StopwatchProps {
  onToggleTimer?: (isRunning: boolean) => void;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ onToggleTimer }) => {
  const [timeMs, setTimeMs] = useState<number>(() => {
    const saved = localStorage.getItem('study_stopwatch_time');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - timeMs;
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setTimeMs(elapsed);
        localStorage.setItem('study_stopwatch_time', elapsed.toString());
      }, 50);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const toggleRunning = () => {
    playSound('click');
    setIsRunning((prev) => {
      const next = !prev;
      onToggleTimer?.(next);
      return next;
    });
  };

  const handleReset = () => {
    playSound('click');
    setIsRunning(false);
    onToggleTimer?.(false);
    setTimeMs(0);
    localStorage.removeItem('study_stopwatch_time');
  };

  // Keyboard shortcut listener for stopwatch (T to toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleRunning();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, timeMs]);

  // Format time
  const totalSeconds = Math.floor(timeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((timeMs % 1000) / 100);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-md">
      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
        <Timer className={`w-4 h-4 ${isRunning ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
        <span className="hidden sm:inline">Timer</span>
      </div>

      <div className="font-mono font-bold text-sm sm:text-base text-slate-100 tracking-tight">
        {hours > 0 && <span>{pad(hours)}:</span>}
        <span>{pad(minutes)}</span>
        <span className="opacity-50">:</span>
        <span>{pad(seconds)}</span>
        <span className="text-xs text-slate-400">.{tenths}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleRunning}
          title={isRunning ? "Pause Stopwatch (or press 't')" : "Start Stopwatch (or press 't')"}
          className={`rounded-full p-1.5 transition-all cursor-pointer ${
            isRunning
              ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          }`}
          aria-label={isRunning ? "Pause Stopwatch" : "Start Stopwatch"}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <button
          onClick={handleReset}
          title="Reset Stopwatch"
          className="rounded-full p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
          aria-label="Reset Stopwatch"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <span className="hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono" title="Press T to toggle timer">
        T
      </span>
    </div>
  );
};
