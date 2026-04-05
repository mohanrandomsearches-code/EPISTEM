import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ChevronRight, BookOpen, Star, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopicCard, TopicStatus, Difficulty } from '../../components/student/TopicCard';
import { cn } from '@/src/lib/utils';

interface Topic {
  id: string;
  title: string;
  icon: string;
  status: TopicStatus;
  difficulty: Difficulty;
  progress: number;
}

export default function TopicsBrowser() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<TopicStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const topics: Topic[] = [
    { id: 'ch1', title: 'Knowing Our Numbers', icon: '🔢', status: 'Completed', difficulty: 'Easy', progress: 100 },
    { id: 'ch2', title: 'Whole Numbers', icon: '🔢', status: 'Needs Review', difficulty: 'Easy', progress: 45 },
    { id: 'ch3', title: 'Playing with Numbers', icon: '🎲', status: 'Completed', difficulty: 'Medium', progress: 100 },
    { id: 'ch4', title: 'Basic Geometrical Ideas', icon: '📐', status: 'In Progress', difficulty: 'Easy', progress: 20 },
    { id: 'ch5', title: 'Understanding Elementary Shapes', icon: '📐', status: 'Needs Review', difficulty: 'Medium', progress: 30 },
    { id: 'ch6', title: 'Integers', icon: '➖', status: 'Not Started', difficulty: 'Medium', progress: 0 },
    { id: 'ch7', title: 'Fractions', icon: '🍰', status: 'In Progress', difficulty: 'Medium', progress: 65 },
    { id: 'ch8', title: 'Decimals', icon: '⏺️', status: 'Not Started', difficulty: 'Medium', progress: 0 },
    { id: 'ch9', title: 'Data Handling', icon: '📊', status: 'Not Started', difficulty: 'Easy', progress: 0 },
    { id: 'ch10', title: 'Mensuration', icon: '📏', status: 'Not Started', difficulty: 'Hard', progress: 0 },
    { id: 'ch11', title: 'Algebra Intro', icon: '✖️', status: 'Not Started', difficulty: 'Hard', progress: 0 },
    { id: 'ch12', title: 'Ratio and Proportion', icon: '⚖️', status: 'Not Started', difficulty: 'Medium', progress: 0 },
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesFilter = filter === 'All' || topic.status === filter;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterOptions: (TopicStatus | 'All')[] = ['All', 'In Progress', 'Completed', 'Needs Review'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">Grade 6 Mathematics</h1>
          <p className="text-muted font-medium">Explore and master each chapter at your own pace.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input 
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white shadow-sm border-2 border-transparent focus:border-primary/20 focus:outline-none transition-all"
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
            {filterOptions.map(option => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                  filter === option ? "bg-primary text-white shadow-md" : "text-muted hover:bg-muted/5"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <TopicCard 
                {...topic} 
                onClick={() => navigate(`/student/topics/${topic.id}`)} 
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="bg-muted/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-muted" />
            </div>
            <h3 className="text-xl font-heading font-bold text-primary">No topics found</h3>
            <p className="text-muted">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => { setFilter('All'); setSearchQuery(''); }}
              className="text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Learning Path Suggestion */}
      <section className="glass-card p-8 bg-gradient-to-br from-accent to-blue-600 text-white border-none shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              <Star className="w-3 h-3 fill-white" />
              Recommended for you
            </div>
            <h2 className="text-3xl font-heading font-bold">Master Integers Next!</h2>
            <p className="text-white/80 max-w-md">
              Based on your progress in "Knowing Our Numbers", you're perfectly ready to tackle Integers. 
              Start now to keep your streak alive!
            </p>
            <button className="bg-white text-accent px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
              Start Integers
            </button>
          </div>
          <div className="hidden md:block">
            <div className="relative w-48 h-48">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-white/20 border-dashed rounded-full"
              />
              <div className="absolute inset-4 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-white/40" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </section>
    </div>
  );
}
