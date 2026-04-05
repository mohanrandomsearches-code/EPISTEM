import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  PlayCircle, 
  BarChart3, 
  ChevronLeft, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  Target, 
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Brain,
  Trophy,
  Timer
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

type Tab = 'Learn' | 'Practice' | 'My Progress';

export default function TopicDetail() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('Learn');

  const topicData = {
    id: topicId,
    title: 'Fractions',
    icon: '🍰',
    description: 'Learn how to represent parts of a whole using numbers.',
    difficulty: 'Medium',
    progress: 65
  };

  const tabs: { id: Tab; icon: React.ReactNode }[] = [
    { id: 'Learn', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'Practice', icon: <PlayCircle className="w-5 h-5" /> },
    { id: 'My Progress', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/student/topics')}
            className="p-3 rounded-2xl bg-white shadow-sm hover:bg-muted/5 transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">{topicData.icon}</span>
              <h1 className="text-3xl font-heading font-bold text-primary">{topicData.title}</h1>
            </div>
            <p className="text-muted font-medium">{topicData.description}</p>
          </div>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm w-full md:w-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
                activeTab === tab.id ? "bg-primary text-white shadow-md" : "text-muted hover:bg-muted/5"
              )}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.id}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[600px]"
        >
          {activeTab === 'Learn' && <LearnTab />}
          {activeTab === 'Practice' && <PracticeTab />}
          {activeTab === 'My Progress' && <ProgressTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LearnTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-8">
        {/* Visual Explanation */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Lightbulb className="w-6 h-6" />
            <h3 className="text-xl font-heading font-bold">Visual Explanation</h3>
          </div>
          <div className="aspect-video bg-muted/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-muted/20 relative group overflow-hidden">
             <div className="text-center space-y-2 relative z-10">
                <div className="flex justify-center gap-2 mb-4">
                   <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold">1</div>
                   <div className="w-1 h-12 bg-muted/20 rounded-full" />
                   <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-white font-bold">4</div>
                </div>
                <p className="text-sm font-bold text-muted uppercase tracking-widest">Numerator & Denominator</p>
             </div>
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-muted leading-relaxed">
            A fraction represents a part of a whole. The <span className="text-primary font-bold">numerator</span> (top) tells us how many parts we have, and the <span className="text-secondary font-bold">denominator</span> (bottom) tells us how many parts the whole is divided into.
          </p>
        </div>

        {/* Audio Explanation */}
        <div className="glass-card p-8 flex items-center justify-between gap-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Volume2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg text-primary">Listen to Explanation</h4>
              <p className="text-xs text-muted font-bold uppercase tracking-wider">2:45 Minutes • English</p>
            </div>
          </div>
          <button className="p-4 bg-white rounded-full shadow-md hover:scale-110 active:scale-95 transition-all text-primary">
            <PlayCircle className="w-8 h-8" />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Step-by-Step Breakdown */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <HelpCircle className="w-6 h-6" />
            <h3 className="text-xl font-heading font-bold">Step-by-Step Breakdown</h3>
          </div>
          <div className="space-y-6">
            {[
              { step: 1, title: 'Identify the Whole', desc: 'Look at the entire object or group you are dividing.' },
              { step: 2, title: 'Count Equal Parts', desc: 'Divide the whole into equal sections and count them.' },
              { step: 3, title: 'Select Parts', desc: 'Choose how many sections you want to represent.' },
              { step: 4, title: 'Write the Fraction', desc: 'Put the selected parts on top and total parts on bottom.' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  {idx < 3 && <div className="w-0.5 h-full bg-primary/20 my-1" />}
                </div>
                <div className="pb-2">
                  <h5 className="font-heading font-bold text-primary">{item.title}</h5>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PracticeTab() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="max-w-3xl mx-auto space-y-10 text-center py-12">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Brain className="w-12 h-12 text-primary" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-3xl font-heading font-bold text-primary">
          Ready to test your skills?
        </h3>
        <p className="text-muted text-lg max-w-md mx-auto">
          Our AI will adapt the difficulty based on your answers to help you learn faster.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="glass-card p-6 space-y-2">
          <Target className="text-accent w-6 h-6 mx-auto" />
          <p className="text-xs font-bold text-muted uppercase">Adaptive</p>
          <p className="text-sm font-bold text-primary">Difficulty</p>
        </div>
        <div className="glass-card p-6 space-y-2">
          <Timer className="text-secondary w-6 h-6 mx-auto" />
          <p className="text-xs font-bold text-muted uppercase">Timed</p>
          <p className="text-sm font-bold text-primary">Challenges</p>
        </div>
        <div className="glass-card p-6 space-y-2">
          <Trophy className="text-primary w-6 h-6 mx-auto" />
          <p className="text-xs font-bold text-muted uppercase">Earn</p>
          <p className="text-sm font-bold text-primary">Bonus XP</p>
        </div>
      </div>

      <div className="pt-8">
        <button 
          onClick={() => navigate(`/student/practice/${topicId}`)}
          className="bg-primary text-white px-12 py-5 rounded-3xl font-bold text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto group"
        >
          Start Practice Mode
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="mt-6 text-sm text-muted flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          10 Questions • 150 XP Potential
        </p>
      </div>
    </div>
  );
}

function ProgressTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 glass-card p-8 flex flex-col items-center justify-center text-center space-y-6">
        <h3 className="text-xl font-heading font-bold text-primary">Accuracy Donut</h3>
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-muted/10" />
            <motion.circle 
              cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" 
              strokeDasharray={2 * Math.PI * 80}
              initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 80) * (1 - 0.85) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-primary"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-heading font-bold text-primary">85%</span>
            <span className="text-xs font-bold text-muted uppercase tracking-widest">Mastery</span>
          </div>
        </div>
        <p className="text-sm text-muted">You're doing great! Just a little more practice to reach 100%.</p>
      </div>

      <div className="md:col-span-2 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-accent/10 text-accent">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-wider">Time Spent</p>
              <h4 className="text-2xl font-heading font-bold text-primary">45m 12s</h4>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-secondary/10 text-secondary">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-wider">Attempt Count</p>
              <h4 className="text-2xl font-heading font-bold text-primary">3 Times</h4>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 space-y-6">
          <h3 className="text-xl font-heading font-bold text-primary">Milestones</h3>
          <div className="space-y-4">
            {[
              { title: 'First Steps', date: 'Oct 12, 2023', icon: <CheckCircle2 className="w-5 h-5 text-primary" /> },
              { title: 'Concept Master', date: 'Oct 14, 2023', icon: <CheckCircle2 className="w-5 h-5 text-primary" /> },
              { title: 'Quiz Whiz', date: 'In Progress', icon: <div className="w-5 h-5 rounded-full border-2 border-dashed border-muted/30" /> },
            ].map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  {m.icon}
                  <span className="font-bold text-primary">{m.title}</span>
                </div>
                <span className="text-xs font-bold text-muted uppercase tracking-widest">{m.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
