import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  MessageCircle, 
  ChevronRight, 
  Clock, 
  Target, 
  Zap,
  Star,
  Smile,
  Award,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgressDonut from '@/src/components/parent/ProgressDonut';
import WeeklySummaryCard from '@/src/components/parent/WeeklySummaryCard';

const MOCK_CHILD = {
  name: "Priya",
  grade: "6A",
  lastActive: "2 hours ago",
  summary: "Priya is showing great focus in Math this week, especially with Integers! She's consistently practicing every day.",
  ratings: {
    math: "🤩",
    consistency: "🔥",
    effort: "💪"
  },
  progress: 68,
  stats: {
    daysActive: [true, true, true, false, true, false, false],
    minutesStudied: 145,
    questionsAnswered: 52
  },
  suggestions: [
    { id: 1, text: "Priya finds fractions tricky. Try the Epistem practice for 10 mins before dinner.", type: "practice" },
    { id: 2, text: "Celebrate Priya — she improved 20% in Integers this week!", type: "celebrate" }
  ]
};

export default function ParentDashboard() {
  const [showDoubtForm, setShowDoubtForm] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header / Child Card */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        
        <div className="relative">
          <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-4xl font-black text-violet-600">P</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
            <Sparkles className="text-white" size={14} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight">
            Hi, {MOCK_CHILD.name}'s Parents! 👋
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-black uppercase tracking-widest">
              Grade {MOCK_CHILD.grade}
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Clock size={14} />
              Last active {MOCK_CHILD.lastActive}
            </div>
          </div>
        </div>

        <Link 
          to="/parent/report"
          className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-violet-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          View Full Report
          <ChevronRight size={18} />
        </Link>
      </section>

      {/* "How is Name doing?" Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-2xl font-black text-[#1A1A2E] flex items-center gap-2">
            <Smile className="text-amber-500" size={28} />
            How is {MOCK_CHILD.name} doing?
          </h2>
          
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">{MOCK_CHILD.ratings.math}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Math</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">{MOCK_CHILD.ratings.consistency}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consistency</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">{MOCK_CHILD.ratings.effort}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Effort</span>
            </div>
          </div>

          <p className="text-lg text-slate-600 font-medium leading-relaxed italic">
            "{MOCK_CHILD.summary}"
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4">
          <ProgressDonut percentage={MOCK_CHILD.progress} />
        </div>
      </section>

      {/* Stats and Help */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <WeeklySummaryCard 
          daysActive={MOCK_CHILD.stats.daysActive}
          minutesStudied={MOCK_CHILD.stats.minutesStudied}
          questionsAnswered={MOCK_CHILD.stats.questionsAnswered}
        />

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-xl font-black text-[#1A1A2E] flex items-center gap-2">
            <Heart className="text-red-500" size={24} />
            You Can Help
          </h3>
          
          <div className="space-y-4">
            {MOCK_CHILD.suggestions.map((suggestion) => (
              <div 
                key={suggestion.id}
                className={`p-5 rounded-2xl border-2 flex gap-4 items-start transition-all hover:scale-[1.02] ${
                  suggestion.type === 'practice' 
                    ? 'bg-amber-50 border-amber-100 text-amber-900' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-900'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  suggestion.type === 'practice' ? 'bg-white text-amber-500' : 'bg-white text-emerald-500'
                }`}>
                  {suggestion.type === 'practice' ? <Target size={20} /> : <Award size={20} />}
                </div>
                <p className="text-sm font-bold leading-relaxed">
                  {suggestion.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ask Teacher Button */}
      <div className="flex justify-center pt-4">
        <button 
          onClick={() => setShowDoubtForm(true)}
          className="group px-10 py-5 bg-[#1A1A2E] text-white rounded-[2rem] font-black text-lg shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
        >
          <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
          Ask Teacher a Question
        </button>
      </div>

      {/* Doubt Form Modal */}
      {showDoubtForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative"
          >
            <button 
              onClick={() => setShowDoubtForm(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Zap size={24} />
            </button>

            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-violet-100/50">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-3xl font-black text-[#1A1A2E]">Ask the Teacher</h3>
              <p className="text-slate-500 font-medium">
                Have a question about {MOCK_CHILD.name}'s progress? Send it to their teacher!
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowDoubtForm(false); alert('Question sent! The teacher will get back to you soon.'); }}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g., Fractions, Homework Help"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-violet-500 transition-all font-bold text-slate-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Your Question</label>
                <textarea 
                  rows={4}
                  placeholder="Describe what you'd like to know..."
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-violet-500 transition-all font-bold text-slate-700 resize-none"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-violet-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-violet-600/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Send Question
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
