import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Clock, AlertTriangle, Play, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type TopicStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Needs Review';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface TopicCardProps {
  id: string;
  title: string;
  icon: string;
  status: TopicStatus;
  difficulty: Difficulty;
  progress: number;
  onClick?: () => void;
  compact?: boolean;
}

export const TopicCard: React.FC<TopicCardProps> = ({ 
  title, 
  icon, 
  status, 
  difficulty, 
  progress, 
  onClick,
  compact = false
}) => {
  
  const statusColors = {
    'Not Started': 'bg-muted/10 text-muted border-muted/20',
    'In Progress': 'bg-accent/10 text-accent border-accent/20',
    'Completed': 'bg-primary/10 text-primary border-primary/20',
    'Needs Review': 'bg-danger/10 text-danger border-danger/20'
  };

  const difficultyColors = {
    'Easy': 'bg-primary/10 text-primary',
    'Medium': 'bg-secondary/10 text-secondary',
    'Hard': 'bg-danger/10 text-danger'
  };

  const statusIcons = {
    'Not Started': <Play className="w-4 h-4" />,
    'In Progress': <Clock className="w-4 h-4" />,
    'Completed': <CheckCircle className="w-4 h-4" />,
    'Needs Review': <AlertTriangle className="w-4 h-4" />
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "glass-card p-5 cursor-pointer group transition-all duration-300 border-2 border-transparent hover:border-primary/20",
        status === 'Needs Review' && "bg-danger/5 border-danger/10"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div>
            <h4 className="font-heading font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", difficultyColors[difficulty])}>
                {difficulty}
              </span>
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", statusColors[status])}>
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-muted/10"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                status === 'Completed' ? "text-primary" : 
                status === 'Needs Review' ? "text-danger" : "text-accent"
              )}
            />
          </svg>
          <span className="absolute text-[10px] font-bold">{progress}%</span>
        </div>
      </div>

      {!compact && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-muted/5">
          <div className="flex items-center gap-2 text-muted text-xs font-medium">
            {statusIcons[status]}
            <span>{status === 'Not Started' ? 'Start Learning' : status === 'In Progress' ? 'Continue' : 'Review Topic'}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </motion.div>
  );
}
