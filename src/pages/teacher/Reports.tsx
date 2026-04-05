import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  FileText, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Copy, 
  Printer,
  Loader2,
  Trophy,
  Target,
  Brain,
  Calendar
} from 'lucide-react';
import { AIReport, buildStudentContext, generateStudentReport } from '@/src/lib/ai/report-generator';

const MOCK_STUDENTS = [
  { id: 's1', name: 'Rahul Student', rollNo: '101', grade: '6A' },
  { id: 's2', name: 'Priya Sharma', rollNo: '102', grade: '6A' },
  { id: 's3', name: 'Arjun Das', rollNo: '103', grade: '6A' },
];

export default function TeacherReports() {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<AIReport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateReport = async () => {
    if (!selectedStudentId) return;
    
    setIsGenerating(true);
    setReport(null);

    try {
      const context = await buildStudentContext(selectedStudentId);
      const data = await generateStudentReport(context);
      setReport(data);
    } catch (error: any) {
      console.error('Report error:', error);
      alert(error.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight">AI Performance Intelligence</h1>
          <p className="text-slate-500">Generate deep insights and personalized plans for your students.</p>
        </div>
        <button 
          onClick={() => window.print()}
          disabled={!report}
          className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-full font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <Printer size={20} />
          Export PDF
        </button>
      </div>

      {/* Student Selector */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search student by name..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#00C9A7] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-10 max-h-60 overflow-y-auto">
                {filteredStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-6 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-700">{student.name}</div>
                      <div className="text-xs text-slate-400">Roll No: {student.rollNo} • {student.grade}</div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex-[0.5]">
            <div className="h-full flex items-center px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700">
              {selectedStudentId ? MOCK_STUDENTS.find(s => s.id === selectedStudentId)?.name : 'Select a student'}
            </div>
          </div>

          <button 
            onClick={handleGenerateReport}
            disabled={!selectedStudentId || isGenerating}
            className="bg-[#4FACFE] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#4FACFE]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Analysing data...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate AI Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Content */}
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-4 border-violet-100 border-t-violet-500 rounded-full"
              />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-500" size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-700">Gemini is thinking...</h3>
              <p className="text-slate-500">Aggregating academic, extracurricular, and behavioral data.</p>
            </div>
          </motion.div>
        ) : report ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block"
          >
            {/* Left Column: Strengths & Weaknesses */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <h3 className="text-xl font-black text-[#1A1A2E] mb-6 flex items-center gap-2">
                  <Trophy className="text-[#00C9A7]" size={24} />
                  Core Insights
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.strengths.map((s, i) => (
                        <span key={i} className="bg-[#00C9A7]/10 text-[#00C9A7] px-4 py-2 rounded-full text-sm font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Areas for Improvement</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.weaknesses.map((w, i) => (
                        <span key={i} className="bg-[#FFB830]/10 text-[#FFB830] px-4 py-2 rounded-full text-sm font-bold">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Weak Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.weak_topics.map((t, i) => (
                        <span key={i} className="bg-red-50 text-red-500 px-4 py-2 rounded-full text-sm font-bold border border-red-100">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Plan */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <h3 className="text-xl font-black text-[#1A1A2E] mb-8 flex items-center gap-2">
                  <Calendar className="text-[#4FACFE]" size={24} />
                  4-Week Improvement Plan
                </h3>
                
                <div className="space-y-6 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-100">
                  {report.improvement_plan.map((step, i) => (
                    <div key={i} className="relative pl-16">
                      <div className="absolute left-0 top-0 w-12 h-12 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center font-black text-[#4FACFE] z-10">
                        W{step.week}
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-slate-700">{step.focus}</h4>
                          <span className="text-xs font-bold text-[#4FACFE] uppercase tracking-widest">Goal: {step.goal}</span>
                        </div>
                        <p className="text-slate-600 text-sm">{step.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Notes & Messages */}
            <div className="space-y-8">
              <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100">
                <h3 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-2">
                  <Brain size={20} />
                  Teacher's Priority
                </h3>
                <p className="text-indigo-700 text-sm leading-relaxed">
                  {report.teacher_notes}
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-800">Parent Message</h3>
                  <button 
                    onClick={() => copyToClipboard(report.parent_message)}
                    className="text-slate-400 hover:text-[#00C9A7] transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed">
                  "{report.parent_message}"
                </div>
                <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest text-center">
                  Friendly • Encouraging • No Jargon
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <h3 className="text-lg font-black text-slate-800 mb-4">Behavioral Insights</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {report.behavioral_insights}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-400">Risk Level</span>
                  <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    report.risk_level === 'low' ? 'bg-green-100 text-green-600' :
                    report.risk_level === 'medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {report.risk_level}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <FileText className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-400">No report generated yet</h3>
            <p className="text-slate-400 max-w-xs mt-2">Select a student and click "Generate AI Report" to see deep insights.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
