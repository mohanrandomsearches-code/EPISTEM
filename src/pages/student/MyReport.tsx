import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Sparkles, 
  Target, 
  Rocket, 
  Star, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  Quote
} from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { AIReport, buildStudentContext, generateStudentReport } from '@/src/lib/ai/report-generator';

export default function StudentMyReport() {
  const { profile } = useAuthStore();
  const [report, setReport] = useState<AIReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const context = await buildStudentContext(profile?.id || 's1');
        const data = await generateStudentReport(context);
        setReport(data);
      } catch (error) {
        console.error('Report error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [profile?.id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-[#00C9A7]/10 border-t-[#00C9A7] rounded-full"
          />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00C9A7]" size={32} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-700">Preparing Your Superpowers...</h3>
          <p className="text-slate-500">Our AI is gathering your achievements.</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-[#00C9A7]/10 text-[#00C9A7] px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest"
        >
          <Sparkles size={18} />
          AI Achievement Report
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-[#1A1A2E] tracking-tight">
          Your Learning Journey, <span className="text-[#00C9A7]">{profile?.name || 'Explorer'}</span>!
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          You've been doing amazing things. Let's look at your superpowers and your next big quests!
        </p>
      </div>

      {/* Superpowers Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFB830] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FFB830]/20">
            <Trophy className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-black text-[#1A1A2E]">Your Superpowers</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.strengths.map((strength, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:scale-[1.02] transition-all"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FFB830]/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#FFB830]/10 rounded-2xl flex items-center justify-center mb-6">
                  <Star className="text-[#FFB830]" size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{strength}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">You've mastered this area with consistent effort and great accuracy!</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Level Up Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#4FACFE] rounded-2xl flex items-center justify-center shadow-lg shadow-[#4FACFE]/20">
            <Rocket className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-black text-[#1A1A2E]">Level Up These Areas</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.weaknesses.map((weakness, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-start gap-6 group hover:border-[#4FACFE]/30 transition-all"
            >
              <div className="w-14 h-14 bg-[#4FACFE]/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                <Target className="text-[#4FACFE]" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{weakness}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">This is your next big quest. With a bit more practice, you'll master this too!</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Weekly Challenge */}
      <section className="bg-gradient-to-br from-[#00C9A7] to-[#4FACFE] p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-[#00C9A7]/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full font-bold text-sm backdrop-blur-md">
              <Zap size={16} />
              Your Weekly Challenge
            </div>
            <h2 className="text-4xl font-black leading-tight">
              Focus on <span className="underline decoration-white/30">{report.improvement_plan[0]?.focus}</span> this week!
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              {report.improvement_plan[0]?.action}
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="bg-white text-[#00C9A7] px-8 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2">
                Start Challenge <ArrowRight size={20} />
              </div>
              <div className="text-white/60 font-bold text-sm">
                Goal: {report.improvement_plan[0]?.goal}
              </div>
            </div>
          </div>
          
          <div className="w-48 h-48 bg-white/10 rounded-[2.5rem] backdrop-blur-md flex items-center justify-center border border-white/20">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Rocket size={80} className="text-white" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Motivational Quote */}
      <div className="text-center space-y-6 pt-8">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <Quote className="text-slate-300" size={24} />
        </div>
        <p className="text-2xl font-black text-slate-400 italic max-w-2xl mx-auto">
          "The expert in anything was once a beginner. Keep exploring, keep learning!"
        </p>
        <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest">
          <CheckCircle2 size={16} className="text-[#00C9A7]" />
          Report Verified by EPISTEM AI
        </div>
      </div>
    </div>
  );
}
