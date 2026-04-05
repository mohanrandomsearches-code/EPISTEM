import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ProgressDonutProps {
  percentage: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressDonut({ 
  percentage, 
  label = "Topics Done", 
  size = 160, 
  strokeWidth = 12 
}: ProgressDonutProps) {
  const [offset, setOffset] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    setOffset(progressOffset);
  }, [percentage, circumference]);

  if (percentage === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <p className="text-sm font-medium text-slate-500">Keep practising to see progress here!</p>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#00C9A7"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-black text-[#1A1A2E]"
        >
          {percentage}%
        </motion.span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}
