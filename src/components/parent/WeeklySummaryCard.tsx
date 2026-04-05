import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface WeeklySummaryCardProps {
  daysActive: boolean[]; // Array of 7 booleans for Mon-Sun
  minutesStudied: number;
  questionsAnswered: number;
}

export default function WeeklySummaryCard({
  daysActive = [true, true, false, true, true, false, false],
  minutesStudied = 120,
  questionsAnswered = 45
}: WeeklySummaryCardProps) {
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#1A1A2E] flex items-center gap-2">
          <Calendar className="text-emerald-500" size={20} />
          This Week
        </h3>
        <div className="flex gap-1.5">
          {daysActive.map((active, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  active ? "bg-[#00C9A7] shadow-sm shadow-[#00C9A7]/30" : "bg-slate-100"
                )}
              />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                {dayLabels[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-emerald-50 transition-colors">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
            <Clock className="text-emerald-500" size={20} />
          </div>
          <span className="text-2xl font-black text-[#1A1A2E]">{minutesStudied}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
            Minutes
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-emerald-50 transition-colors">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="text-emerald-500" size={20} />
          </div>
          <span className="text-2xl font-black text-[#1A1A2E]">{questionsAnswered}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
            Questions
          </span>
        </div>
      </div>
    </div>
  );
}
