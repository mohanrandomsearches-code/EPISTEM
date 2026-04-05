import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Coffee, Brain, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface FocusTimerProps {
  onComplete?: () => void;
  onClose?: () => void;
}

export default function FocusTimer({ onComplete, onClose }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [showBreakCard, setShowBreakCard] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const playChime = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5); // A4

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      playChime();
      if (mode === 'study') {
        setShowBreakCard(true);
        onComplete?.();
      } else {
        setMode('study');
        setTimeLeft(20 * 60);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? 20 * 60 : 5 * 60);
  };

  const startBreak = () => {
    setMode('break');
    setTimeLeft(5 * 60);
    setIsActive(true);
    setShowBreakCard(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft / (mode === 'study' ? 20 * 60 : 5 * 60);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card w-full max-w-md p-8 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-muted" />
        </button>

        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {mode === 'study' ? (
              <Brain className="w-6 h-6 text-primary" />
            ) : (
              <Coffee className="w-6 h-6 text-secondary" />
            )}
            <h2 className="text-2xl font-heading font-bold text-primary">
              {mode === 'study' ? 'Focus Session' : 'Short Break'}
            </h2>
          </div>

          <div className="relative flex items-center justify-center py-8">
            <svg className="w-64 h-64 -rotate-90">
              <circle
                cx="128"
                cy="128"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted/10"
              />
              <motion.circle
                cx="128"
                cy="128"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.5, ease: "linear" }}
                className={mode === 'study' ? "text-primary" : "text-secondary"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-mono font-bold text-primary tracking-tighter">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs font-bold text-muted uppercase tracking-widest mt-2">
                {mode === 'study' ? 'Studying' : 'Resting'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={resetTimer}
              className="p-4 rounded-2xl bg-muted/10 text-muted hover:bg-muted/20 transition-all active:scale-90"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button
              onClick={toggleTimer}
              className={cn(
                "p-6 rounded-3xl shadow-xl transition-all active:scale-90",
                isActive ? "bg-secondary text-white" : "bg-primary text-white"
              )}
            >
              {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
            <button
              onClick={() => {
                setMode(mode === 'study' ? 'break' : 'study');
                setTimeLeft(mode === 'study' ? 5 * 60 : 20 * 60);
                setIsActive(false);
              }}
              className="p-4 rounded-2xl bg-muted/10 text-muted hover:bg-muted/20 transition-all active:scale-90"
            >
              {mode === 'study' ? <Coffee className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showBreakCard && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute inset-0 bg-primary flex flex-col items-center justify-center p-8 text-center text-white z-10"
            >
              <div className="bg-white/20 p-6 rounded-full mb-6">
                <Coffee className="w-16 h-16" />
              </div>
              <h3 className="text-3xl font-heading font-bold mb-2">Session Complete!</h3>
              <p className="text-white/80 mb-8">You've earned a break. Your brain will thank you!</p>
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={startBreak}
                  className="w-full bg-white text-primary py-4 rounded-2xl font-bold shadow-lg hover:bg-white/90 transition-all active:scale-95"
                >
                  Take 5 Min Break
                </button>
                <button
                  onClick={() => setShowBreakCard(false)}
                  className="w-full bg-transparent border-2 border-white/30 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95"
                >
                  Skip Break
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
