import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Send, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle,
  AlertCircle,
  User,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { getDoubts, submitDoubt, Doubt } from '@/src/lib/doubts-service';
import { cn } from '@/src/lib/utils';

const TOPICS = [
  { id: 't1', name: 'Integers' },
  { id: 't2', name: 'Fractions' },
  { id: 't3', name: 'Decimals' },
  { id: 't4', name: 'Geometry' },
  { id: 't5', name: 'Algebra' },
];

export default function StudentDoubts() {
  const { profile } = useAuthStore();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [topicId, setTopicId] = useState('');
  const [question, setQuestion] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedDoubt, setExpandedDoubt] = useState<string | null>(null);

  useEffect(() => {
    // Load doubts for this student
    const allDoubts = getDoubts();
    setDoubts(allDoubts.filter(d => d.studentId === profile?.id));
  }, [profile?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicId || question.length < 20 || isSubmitting) return;

    setIsSubmitting(true);
    const topicName = TOPICS.find(t => t.id === topicId)?.name || 'General';
    
    setTimeout(() => {
      const newDoubt = submitDoubt(
        profile?.id || 'anon',
        profile?.name || 'Student',
        topicId,
        topicName,
        question,
        isAnonymous
      );
      
      setDoubts(prev => [newDoubt, ...prev]);
      setTopicId('');
      setQuestion('');
      setIsAnonymous(false);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      {/* Header */}
      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-[#00C9A7] rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-[#00C9A7]/20 rotate-3">
          <HelpCircle className="text-white" size={40} />
        </div>
        <h1 className="text-4xl font-black text-[#1A1A2E] tracking-tight">Got a Doubt?</h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
          Don't stay stuck! Ask your teacher anything about your lessons.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* New Doubt Form (2/5) */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl font-black text-[#1A1A2E] flex items-center gap-2">
              <Send className="text-[#00C9A7]" size={24} />
              Ask New Question
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Topic</label>
                <select 
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#00C9A7] transition-all font-bold text-slate-700 appearance-none"
                  required
                >
                  <option value="">Select a topic...</option>
                  {TOPICS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Your Question</label>
                <textarea 
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What exactly are you stuck on?"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#00C9A7] transition-all font-bold text-slate-700 resize-none"
                  required
                  minLength={20}
                />
                <div className="flex justify-between px-4">
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest", question.length < 20 ? "text-red-400" : "text-emerald-500")}>
                    {question.length}/20 min chars
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      isAnonymous ? "bg-slate-400" : "bg-slate-200"
                    )}
                  >
                    <motion.div 
                      animate={{ x: isAnonymous ? 24 : 4 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Anonymous</span>
                </div>
                {isAnonymous && <EyeOff size={16} className="text-slate-400" />}
              </div>

              <button 
                type="submit"
                disabled={!topicId || question.length < 20 || isSubmitting}
                className="w-full py-5 bg-[#00C9A7] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#00C9A7]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full" />
                ) : (
                  <>
                    <Send size={20} />
                    Send Doubt
                  </>
                )}
              </button>
            </form>
          </section>

          <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex gap-4">
            <AlertCircle className="text-amber-500 shrink-0" size={24} />
            <p className="text-sm font-bold text-amber-900 leading-relaxed">
              Teachers usually reply within 24 hours. You'll get a notification when your doubt is answered!
            </p>
          </div>
        </div>

        {/* My Doubts List (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-[#1A1A2E]">My Doubts</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Clock size={14} />
              {doubts.length} Total
            </div>
          </div>

          {doubts.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                <MessageCircle size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No doubts yet!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {doubts.map((doubt) => (
                <motion.div 
                  key={doubt.id}
                  layout
                  className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden"
                >
                  <div 
                    className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => doubt.isAnswered && setExpandedDoubt(expandedDoubt === doubt.id ? null : doubt.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {doubt.topicName}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(doubt.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        doubt.isAnswered ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                      )}>
                        {doubt.isAnswered ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {doubt.isAnswered ? 'Answered' : 'Pending'}
                      </div>
                    </div>
                    
                    <p className="text-slate-700 font-bold leading-relaxed line-clamp-2">
                      {doubt.question}
                    </p>

                    {doubt.isAnswered && (
                      <div className="mt-4 flex items-center justify-center text-violet-500">
                        {expandedDoubt === doubt.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedDoubt === doubt.id && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-violet-50/30 border-t border-violet-50"
                      >
                        <div className="p-8 space-y-4">
                          <div className="flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase tracking-widest">
                            <User size={12} />
                            Teacher's Reply
                          </div>
                          <p className="text-slate-700 font-medium leading-relaxed bg-white p-6 rounded-2xl border border-violet-100 shadow-sm">
                            {doubt.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
