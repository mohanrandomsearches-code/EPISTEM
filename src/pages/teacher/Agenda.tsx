import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Save, 
  Clock, 
  LayoutList, 
  LayoutGrid,
  Plus,
  Trash2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { suggestAgendaActivity } from '@/src/lib/ai/agenda-service';
import { cn } from '@/src/lib/utils';

interface AgendaSlot {
  topic: string;
  notes: string;
}

interface DayAgenda {
  [slot: string]: AgendaSlot;
}

interface MonthlyAgenda {
  [date: string]: DayAgenda;
}

const SLOTS = [
  'Morning Prep',
  'Period 1',
  'Period 2',
  'Break',
  'Period 3',
  'Period 4',
  'Period 5'
];

const MOCK_WEAK_TOPICS = ['Geometry', 'Fractions', 'Decimals'];

export default function TeacherAgenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [agendas, setAgendas] = useState<MonthlyAgenda>({});
  const [isSuggesting, setIsSuggesting] = useState<string | null>(null);

  // Load agendas from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('epistem_agendas');
    if (saved) setAgendas(JSON.parse(saved));
  }, []);

  // Save agendas to localStorage
  useEffect(() => {
    localStorage.setItem('epistem_agendas', JSON.stringify(agendas));
  }, [agendas]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleSaveSlot = (date: Date, slot: string, topic: string, notes: string) => {
    const key = formatDateKey(date);
    setAgendas(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [slot]: { topic, notes }
      }
    }));
  };

  const handleAISuggest = async (slot: string) => {
    if (!selectedDate) return;
    setIsSuggesting(slot);
    try {
      const suggestion = await suggestAgendaActivity(slot, selectedDate.toDateString(), MOCK_WEAK_TOPICS);
      const [topic, ...notes] = suggestion.split('\n');
      handleSaveSlot(selectedDate, slot, topic.replace(/^\d+\.\s*Topic:\s*/i, '').trim(), notes.join('\n').trim());
    } catch (error) {
      console.error('AI Suggestion error:', error);
    } finally {
      setIsSuggesting(null);
    }
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-slate-50/50 border border-slate-100" />);
    }

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      const isToday = formatDateKey(date) === formatDateKey(new Date());
      const isSelected = selectedDate && formatDateKey(date) === formatDateKey(selectedDate);
      const hasAgenda = agendas[formatDateKey(date)];
      const isPast = date < new Date(new Date().setHours(0,0,0,0));

      days.push(
        <div 
          key={d}
          onClick={() => setSelectedDate(date)}
          className={cn(
            "h-32 p-4 border border-slate-100 transition-all cursor-pointer relative group",
            isSelected ? "bg-violet-50/50 ring-2 ring-violet-500 ring-inset z-10" : "bg-white hover:bg-slate-50",
            isToday && "bg-emerald-50/30",
            isPast && "opacity-60"
          )}
        >
          <div className="flex justify-between items-start">
            <span className={cn(
              "text-sm font-black w-8 h-8 flex items-center justify-center rounded-full",
              isToday ? "bg-emerald-500 text-white" : "text-slate-400 group-hover:text-slate-600"
            )}>
              {d}
            </span>
            {hasAgenda && (
              <div className="w-2 h-2 bg-[#00C9A7] rounded-full shadow-sm shadow-[#00C9A7]/50" />
            )}
          </div>
          <div className="mt-2 space-y-1">
            {hasAgenda && Object.values(hasAgenda).slice(0, 2).map((slot, i) => (
              <div key={i} className="text-[10px] font-bold text-slate-500 truncate bg-slate-100 px-2 py-0.5 rounded">
                {slot.topic}
              </div>
            ))}
            {hasAgenda && Object.keys(hasAgenda).length > 2 && (
              <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest pl-1">
                + {Object.keys(hasAgenda).length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 border-l border-t border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-slate-50 p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-b border-slate-100">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = [];
    const startOfWeek = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(startOfWeek.getDate() + i);
      const key = formatDateKey(date);
      const agenda = agendas[key];

      days.push(
        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black">
                {date.getDate()}
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1A1A2E]">{date.toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <button 
              onClick={() => { setSelectedDate(date); setView('month'); }}
              className="p-3 text-slate-300 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {SLOTS.map(slot => (
              <div 
                key={slot}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                  agenda?.[slot] ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-400"
                )}
              >
                {slot}: {agenda?.[slot]?.topic || 'Free'}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <div className="space-y-6">{days}</div>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-[#00C9A7] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00C9A7]/20">
              <CalendarIcon className="text-white" size={28} />
            </div>
            Agenda Planner
          </h1>
          <p className="text-slate-500 font-medium ml-16">
            Plan your lessons and activities with AI-powered suggestions.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <button
              onClick={() => setView('month')}
              className={cn(
                "p-3 rounded-xl transition-all",
                view === 'month' ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setView('week')}
              className={cn(
                "p-3 rounded-xl transition-all",
                view === 'week' ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutList size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <button onClick={handlePrevMonth} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 text-sm font-black text-[#1A1A2E] uppercase tracking-widest min-w-[140px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={handleNextMonth} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar/Week View (8/12) */}
        <div className="lg:col-span-8">
          {view === 'month' ? renderMonthView() : renderWeekView()}
        </div>

        {/* Day Detail Panel (4/12) */}
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedDate ? (
              <motion.div
                key={formatDateKey(selectedDate)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden sticky top-24"
              >
                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-violet-600 font-black text-xl">
                      {selectedDate.getDate()}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#1A1A2E]">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 max-h-[calc(100vh-24rem)]">
                  {SLOTS.map((slot) => {
                    const agenda = agendas[formatDateKey(selectedDate)]?.[slot];
                    return (
                      <div key={slot} className="space-y-3 group">
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Clock size={12} />
                            {slot}
                          </div>
                          <button 
                            onClick={() => handleAISuggest(slot)}
                            disabled={isSuggesting === slot}
                            className="p-2 text-violet-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            title="AI Suggest Activity"
                          >
                            {isSuggesting === slot ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-violet-200 border-t-violet-600 rounded-full" />
                            ) : (
                              <Sparkles size={16} />
                            )}
                          </button>
                        </div>
                        <div className="space-y-2">
                          <input 
                            type="text"
                            placeholder="Topic/Subject..."
                            value={agenda?.topic || ''}
                            onChange={(e) => handleSaveSlot(selectedDate, slot, e.target.value, agenda?.notes || '')}
                            className="w-full px-6 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-violet-500 transition-all font-bold text-slate-700 text-sm"
                          />
                          <textarea 
                            rows={2}
                            placeholder="Activity notes..."
                            value={agenda?.notes || ''}
                            onChange={(e) => handleSaveSlot(selectedDate, slot, agenda?.topic || '', e.target.value)}
                            className="w-full px-6 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-violet-500 transition-all font-medium text-slate-600 text-xs resize-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-8 border-t border-slate-50 bg-slate-50/30">
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                    <Lightbulb className="text-amber-500 shrink-0" size={20} />
                    <p className="text-[10px] font-bold text-amber-900 leading-relaxed uppercase tracking-tight">
                      AI Tip: Your class is struggling with <strong>Geometry</strong>. Try focusing Period 1 on basic shapes!
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center h-full p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                  <CalendarIcon size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#1A1A2E]">Select a Date</h3>
                  <p className="text-slate-400 font-medium max-w-xs mx-auto">
                    Click on a day in the calendar to plan your teaching agenda.
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
