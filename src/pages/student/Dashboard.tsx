import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  CheckCircle, 
  Target, 
  MessageSquare, 
  FileText, 
  PlayCircle, 
  Timer, 
  ChevronRight,
  User,
  Search,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import XPBar from '../../components/student/XPBar';
import { TopicCard } from '../../components/student/TopicCard';
import FocusTimer from '../../components/student/FocusTimer';
import { cn } from '@/src/lib/utils';

export default function StudentDashboard() {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const [showFocusTimer, setShowFocusTimer] = useState(false);

  const stats = [
    { label: 'Streak', value: '12 Days', icon: <Flame className="w-6 h-6 text-orange-500" />, color: 'bg-orange-50' },
    { label: 'Topics Done', value: '24', icon: <CheckCircle className="w-6 h-6 text-primary" />, color: 'bg-primary/10' },
    { label: 'Accuracy', value: '92%', icon: <Target className="w-6 h-6 text-accent" />, color: 'bg-accent/10' },
  ];

  const continueLearning = {
    id: 'ch7',
    title: 'Fractions',
    icon: '🍰',
    status: 'In Progress' as const,
    difficulty: 'Medium' as const,
    progress: 65
  };

  const needsPractice = [
    { id: 'ch2', title: 'Whole Numbers', icon: '🔢', status: 'Needs Review' as const, difficulty: 'Easy' as const, progress: 45 },
    { id: 'ch5', title: 'Elementary Shapes', icon: '📐', status: 'Needs Review' as const, difficulty: 'Medium' as const, progress: 30 },
  ];

  const quickActions = [
    { label: 'Ask Doubt', icon: <MessageSquare className="w-6 h-6" />, color: 'bg-primary', onClick: () => {} },
    { label: 'View My Report', icon: <FileText className="w-6 h-6" />, color: 'bg-secondary', onClick: () => {} },
    { label: 'Practice Test', icon: <PlayCircle className="w-6 h-6" />, color: 'bg-accent', onClick: () => {} },
    { label: 'Focus Mode', icon: <Timer className="w-6 h-6" />, color: 'bg-ai-purple', onClick: () => setShowFocusTimer(true) },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 py-8 space-y-10"
    >
      {/* Top Greeting Bar */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {profile?.name?.split(' ').map(n => n[0]).join('') || 'S'}
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">
              Hi, {profile?.name?.split(' ')[0] || 'Explorer'}! 👋
            </h1>
            <p className="text-muted font-medium">Ready for some math magic today?</p>
          </div>
        </div>
        
        <div className="w-full md:w-96 glass-card p-4">
          <XPBar 
            currentXP={340} 
            nextLevelXP={500} 
            levelName="Math Explorer" 
            level={5} 
          />
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="glass-card p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={cn("p-4 rounded-2xl", stat.color)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-muted uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-heading font-bold text-primary">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Continue Learning */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-primary">Continue Learning</h2>
              <button 
                onClick={() => navigate('/student/topics')}
                className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
              >
                View All Topics <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group">
              <TopicCard {...continueLearning} onClick={() => navigate(`/student/topics/${continueLearning.id}`)} />
              <button 
                onClick={() => navigate(`/student/topics/${continueLearning.id}`)}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
              >
                Resume Learning
              </button>
            </div>
          </section>

          {/* Needs Practice */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary">Needs Practice</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {needsPractice.map(topic => (
                <TopicCard 
                  key={topic.id} 
                  id={topic.id}
                  title={topic.title}
                  icon={topic.icon}
                  status={topic.status}
                  difficulty={topic.difficulty}
                  progress={topic.progress}
                  compact 
                  onClick={() => navigate(`/student/topics/${topic.id}`)} 
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Quick Actions */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  className="glass-card p-6 flex flex-col items-center justify-center gap-3 text-center group"
                >
                  <div className={cn("p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform", action.color)}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-bold text-muted group-hover:text-primary transition-colors">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Daily Challenge */}
          <section className="glass-card p-6 bg-gradient-to-br from-secondary to-orange-400 text-white border-none shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 animate-pulse" />
              <h3 className="text-xl font-heading font-bold">Daily Challenge</h3>
            </div>
            <p className="text-white/90 text-sm mb-6 leading-relaxed">
              Solve 5 fraction problems correctly to earn a <span className="font-bold">Rare Badge</span> and 100 bonus XP!
            </p>
            <button className="w-full bg-white text-secondary py-3 rounded-xl font-bold shadow-lg hover:bg-white/90 transition-all active:scale-95">
              Start Challenge
            </button>
          </section>
        </div>
      </div>

      {showFocusTimer && (
        <FocusTimer onClose={() => setShowFocusTimer(false)} />
      )}
    </motion.div>
  );
}
