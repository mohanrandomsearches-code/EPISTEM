import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Send, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter,
  User,
  EyeOff,
  ChevronRight,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { getDoubts, replyToDoubt, Doubt } from '@/src/lib/doubts-service';
import { cn } from '@/src/lib/utils';

export default function TeacherDoubts() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('pending');
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const allDoubts = getDoubts();
    setDoubts(allDoubts);
  }, []);

  const filteredDoubts = doubts.filter(d => {
    if (filter === 'pending') return !d.isAnswered;
    if (filter === 'answered') return d.isAnswered;
    return true;
  }).sort((a, b) => b.createdAt - a.createdAt);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoubt || !reply.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const updated = replyToDoubt(selectedDoubt.id, reply);
      if (updated) {
        setDoubts(prev => prev.map(d => d.id === updated.id ? updated : d));
        setSelectedDoubt(null);
        setReply('');
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-600/20">
              <MessageCircle className="text-white" size={28} />
            </div>
            Doubt Inbox
          </h1>
          <p className="text-slate-500 font-medium ml-16">
            Help your students clear their concepts in real-time.
          </p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          {(['pending', 'answered', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                filter === f ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-16rem)] min-h-[600px]">
        {/* Inbox List (2/5) */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto pr-4 scroll-smooth">
          {filteredDoubts.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Inbox is clear!</p>
            </div>
          ) : (
            filteredDoubts.map((doubt) => (
              <motion.div
                key={doubt.id}
                layout
                onClick={() => setSelectedDoubt(doubt)}
                className={cn(
                  "p-6 rounded-[2rem] border-2 transition-all cursor-pointer group relative overflow-hidden",
                  selectedDoubt?.id === doubt.id 
                    ? "bg-violet-50 border-violet-200 shadow-md" 
                    : "bg-white border-slate-100 hover:border-violet-100 hover:shadow-sm"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      {doubt.isAnonymous ? <EyeOff size={16} /> : <User size={16} />}
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">
                      {doubt.isAnonymous ? 'Anonymous' : doubt.studentName}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(doubt.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mb-3">
                  <span className="px-2 py-0.5 bg-violet-100 text-violet-600 rounded text-[9px] font-black uppercase tracking-widest">
                    {doubt.topicName}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-700 leading-relaxed line-clamp-2">
                  {doubt.question}
                </p>

                <div className="absolute top-0 right-0 w-1 h-full bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))
          )}
        </div>

        {/* Reply Panel (3/5) */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedDoubt ? (
              <motion.div
                key={selectedDoubt.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden"
              >
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      {selectedDoubt.isAnonymous ? <EyeOff className="text-slate-400" size={24} /> : <User className="text-violet-600" size={24} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#1A1A2E]">
                        {selectedDoubt.isAnonymous ? 'Anonymous Student' : selectedDoubt.studentName}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Asked on {new Date(selectedDoubt.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDoubt(null)}
                    className="p-3 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <AlertCircle size={12} />
                      Student's Question
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-violet-600 font-black italic">
                        "
                      </div>
                      <p className="text-lg font-bold text-slate-700 leading-relaxed italic">
                        {selectedDoubt.question}
                      </p>
                    </div>
                  </div>

                  {selectedDoubt.isAnswered ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        <CheckCircle2 size={12} />
                        Your Answer
                      </div>
                      <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100">
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {selectedDoubt.answer}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleReply} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Your Reply</label>
                        <textarea 
                          rows={6}
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder="Type your explanation here..."
                          className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-violet-500 transition-all font-bold text-slate-700 resize-none"
                          required
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={!reply.trim() || isSubmitting}
                        className="w-full py-5 bg-violet-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-violet-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full" />
                        ) : (
                          <>
                            <Send size={20} />
                            Mark as Answered
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center h-full p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                  <MessageCircle size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#1A1A2E]">Select a Doubt</h3>
                  <p className="text-slate-400 font-medium max-w-xs mx-auto">
                    Choose a doubt from the inbox to view details and provide a reply.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
