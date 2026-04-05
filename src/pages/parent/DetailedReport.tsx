import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  Rocket, 
  Target, 
  MessageSquare, 
  HelpCircle, 
  ChevronLeft, 
  Star, 
  Zap,
  Sparkles,
  Trophy,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_REPORT = {
  childName: "Priya",
  parentMessage: "Priya is making fantastic progress! She's now comfortable with negative numbers and is starting to show real confidence in solving multi-step problems. Her consistency is her superpower.",
  strengths: [
    { id: 1, title: "Negative Number Ninja", icon: <Zap size={24} />, color: "bg-amber-100 text-amber-600", border: "border-amber-200" },
    { id: 2, title: "Consistency King", icon: <Trophy size={24} />, color: "bg-emerald-100 text-emerald-600", border: "border-emerald-200" },
    { id: 3, title: "Problem Solver", icon: <Rocket size={24} />, color: "bg-blue-100 text-blue-600", border: "border-blue-200" }
  ],
  weaknesses: [
    { id: 1, title: "Fractions Expedition", description: "Exploring how to add and subtract parts of a whole.", icon: <Compass size={20} /> },
    { id: 2, title: "Decimal Discovery", description: "Learning how to work with numbers smaller than one.", icon: <Target size={20} /> }
  ],
  weeklyChallenge: {
    title: "The Fraction Quest",
    description: "Complete 3 practice sessions on 'Equivalent Fractions' this week to earn the 'Fraction Master' badge!",
    reward: "Fraction Master Badge"
  },
  teacherNotes: "Priya is a joy to have in class. She's always ready to help others and her curiosity is infectious. Keep encouraging her to explain her math thinking out loud at home!",
  recentQuestions: [
    { id: 1, topic: "Fractions Homework Help", status: "Answered" },
    { id: 2, topic: "Upcoming Test Syllabus", status: "Pending" }
  ]
};

export default function DetailedReport() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/parent"
          className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={20} />
          Back to Home
        </Link>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
          <Star size={14} fill="currentColor" />
          Weekly Report Ready
        </div>
      </div>

      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-violet-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-violet-600/20 rotate-3">
          <Award className="text-white" size={40} />
        </div>
        <h1 className="text-4xl font-black text-[#1A1A2E] tracking-tight">
          {MOCK_REPORT.childName}'s Progress Report
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto italic">
          "{MOCK_REPORT.parentMessage}"
        </p>
      </header>

      {/* Achievement Badges */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-[#1A1A2E] flex items-center gap-2">
          <Trophy className="text-amber-500" size={28} />
          Recent Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_REPORT.strengths.map((strength, i) => (
            <motion.div 
              key={strength.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-[2.5rem] border-2 ${strength.border} ${strength.color} flex flex-col items-center text-center gap-4 shadow-sm hover:scale-105 transition-all`}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                {strength.icon}
              </div>
              <span className="font-black text-sm uppercase tracking-tight leading-tight">
                {strength.title}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Adventures (Weaknesses) */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-[#1A1A2E] flex items-center gap-2">
          <Compass className="text-blue-500" size={28} />
          Upcoming Adventures
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_REPORT.weaknesses.map((adventure) => (
            <div 
              key={adventure.id}
              className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-6 items-start hover:border-blue-200 transition-all group"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {adventure.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-[#1A1A2E]">{adventure.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {adventure.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Challenge & Teacher Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-gradient-to-br from-violet-600 to-indigo-700 p-10 rounded-[3rem] text-white space-y-6 shadow-xl shadow-violet-200 relative overflow-hidden">
          <Sparkles className="absolute top-6 right-6 opacity-20" size={64} />
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              Weekly Challenge
            </div>
            <h3 className="text-3xl font-black leading-tight">{MOCK_REPORT.weeklyChallenge.title}</h3>
            <p className="text-violet-100 font-medium leading-relaxed">
              {MOCK_REPORT.weeklyChallenge.description}
            </p>
            <div className="pt-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Reward</p>
                <p className="font-black">{MOCK_REPORT.weeklyChallenge.reward}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-2xl font-black text-[#1A1A2E] flex items-center gap-2">
            <MessageSquare className="text-emerald-500" size={28} />
            Teacher's Notes
          </h3>
          <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-emerald-500 italic text-slate-600 font-medium leading-relaxed">
            "{MOCK_REPORT.teacherNotes}"
          </div>
          <div className="pt-4 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Questions</h4>
            <div className="space-y-3">
              {MOCK_REPORT.recentQuestions.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-sm font-bold text-slate-700">{q.topic}</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    q.status === 'Answered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
