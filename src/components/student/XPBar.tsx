import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Star } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  levelName: string;
  level: number;
}

export default function XPBar({ currentXP, nextLevelXP, levelName, level }: XPBarProps) {
  const [prevLevel, setPrevLevel] = useState(level);
  const progress = (currentXP / nextLevelXP) * 100;

  useEffect(() => {
    if (level > prevLevel) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00C9A7', '#FFB830', '#4FACFE']
      });
      setPrevLevel(level);
    }
  }, [level, prevLevel]);

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <div className="bg-secondary p-2 rounded-xl shadow-sm">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider">Level {level}</p>
            <h3 className="text-lg font-heading font-bold text-primary leading-tight">{levelName}</h3>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-primary">{currentXP}</span>
          <span className="text-sm text-muted"> / {nextLevelXP} XP</span>
        </div>
      </div>

      <div className="relative h-4 w-full bg-white rounded-full shadow-inner overflow-hidden border-2 border-white">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-[0_0_10px_rgba(0,201,167,0.4)]"
        />
        
        {/* Subtle sparkle effect on the bar */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
        />
      </div>

      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-secondary fill-secondary" />
          <span className="text-[10px] font-bold text-muted uppercase tracking-tighter">Daily Goal: 80%</span>
        </div>
        <span className="text-[10px] font-bold text-muted uppercase tracking-tighter">Next Milestone: 500 XP</span>
      </div>
    </div>
  );
}
