
import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Target, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  ChevronDown,
  Sparkles,
  Award,
  Activity,
  Palette,
  Trophy,
  Brain
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { cn } from '@/src/lib/utils';

const accuracyData = [
  { week: 'W1', accuracy: 65 },
  { week: 'W2', accuracy: 68 },
  { week: 'W3', accuracy: 62 },
  { week: 'W4', accuracy: 75 },
  { week: 'W5', accuracy: 72 },
  { week: 'W6', accuracy: 80 },
  { week: 'W7', accuracy: 78 },
  { week: 'W8', accuracy: 85 },
];

const errorData = [
  { name: 'Calculation', value: 45, color: '#FF6B6B' },
  { name: 'Concept', value: 30, color: '#7C3AED' },
  { name: 'Careless', value: 15, color: '#FFB830' },
  { name: 'Formula', value: 10, color: '#4FACFE' },
];

const topics = [
  { name: 'Fractions', score: 85 },
  { name: 'Decimals', score: 72 },
  { name: 'Geometry', score: 45 },
  { name: 'Algebra', score: 68 },
  { name: 'Ratios', score: 92 },
  { name: 'Division', score: 55 },
  { name: 'Multiplication', score: 88 },
  { name: 'Measurement', score: 62 },
];

const extracurricular = [
  { label: 'Sports', score: 8, icon: <Trophy size={16} />, color: 'bg-primary' },
  { label: 'Arts', score: 6, icon: <Palette size={16} />, color: 'bg-accent' },
  { label: 'Participation', score: 9, icon: <Activity size={16} />, color: 'bg-secondary' },
  { label: 'Consistency', score: 7, icon: <Clock size={16} />, color: 'bg-ai-purple' },
];

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = {
    name: 'Rahul Sharma',
    rollNo: '6A01',
    grade: '6th Grade',
    class: 'Section A',
    lastActive: '2 hours ago',
    avatar: 'RS'
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/teacher/class')}
          className="p-3 rounded-2xl bg-white shadow-sm hover:bg-muted/5 transition-all active:scale-90"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Student Profile</h1>
          <p className="text-muted">Viewing detailed performance for {student.name}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-8 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mx-auto shadow-inner">
              {student.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-primary">{student.name}</h2>
              <p className="text-muted font-medium">{student.grade} • {student.class}</p>
              <p className="text-xs text-muted font-bold uppercase tracking-widest mt-2">Roll No: {student.rollNo}</p>
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <div className="text-center">
                <p className="text-xs font-bold text-muted uppercase">Last Active</p>
                <p className="text-sm font-bold text-primary">{student.lastActive}</p>
              </div>
              <div className="w-px h-8 bg-muted/10 self-center" />
              <div className="text-center">
                <p className="text-xs font-bold text-muted uppercase">Status</p>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-success/10 text-success rounded-full">On Track</span>
              </div>
            </div>
            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <MessageSquare size={18} />
              Message Parent
            </button>
          </div>

          {/* AI Insights */}
          <div className="glass-card p-8 space-y-6 bg-gradient-to-br from-ai-purple/5 to-accent/5 border-ai-purple/10">
            <div className="flex items-center gap-3 text-ai-purple">
              <Sparkles size={24} />
              <h3 className="text-xl font-heading font-bold">AI Insights</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={14} />
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Accuracy in <span className="font-bold text-primary">Fractions</span> has improved by 20% this month.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-danger/10 text-danger flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={14} />
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Frequent errors in <span className="font-bold text-primary">Geometry</span> suggest a conceptual gap in angles.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                  <Award size={14} />
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Highly consistent in daily practice. Streak: 12 days.
                </p>
              </li>
            </ul>
          </div>

          {/* Psychometric Baseline */}
          <div className="glass-card p-8 space-y-6 border-mint/20 bg-mint/[0.02]">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
                <Brain className="text-mint" size={24} />
                Baseline Test
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-mint/10 text-mint rounded-full uppercase tracking-widest">
                Completed
              </span>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-primary">12</span>
              <span className="text-lg text-muted font-bold mb-1">/ 15</span>
              <div className="ml-auto text-right">
                <p className="text-[10px] font-bold text-muted uppercase tracking-tighter">Confidence Profile</p>
                <p className="text-sm font-black text-accent uppercase">Balanced</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Math', score: 3, total: 4, color: 'bg-primary' },
                { label: 'Science', score: 4, total: 4, color: 'bg-accent' },
                { label: 'English', score: 3, total: 4, color: 'bg-secondary' },
                { label: 'Reasoning', score: 2, total: 3, color: 'bg-ai-purple' },
              ].map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-muted">{s.label}</span>
                    <span className="text-primary">{s.score}/{s.total}</span>
                  </div>
                  <div className="h-1.5 bg-muted/10 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", s.color)} style={{ width: `${(s.score/s.total)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-muted/10 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-muted uppercase">Initial Difficulty</p>
                <p className="text-sm font-bold text-primary">Level 2 (Medium)</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted uppercase">Date Taken</p>
                <p className="text-sm font-bold text-primary">April 4, 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Accuracy Timeline */}
          <div className="glass-card p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
                <TrendingUp className="text-primary" size={20} />
                Weekly Accuracy Timeline
              </h3>
              <select className="text-xs font-bold text-muted bg-muted/5 border-none rounded-lg px-3 py-1.5 outline-none">
                <option>Last 8 Weeks</option>
                <option>Last 4 Weeks</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7A99', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7A99', fontSize: 12, fontWeight: 600 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#00C9A7" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#00C9A7', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Error Pattern */}
            <div className="glass-card p-8 space-y-6">
              <h3 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
                <AlertTriangle className="text-danger" size={20} />
                Error Distribution
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={errorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {errorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Extracurricular */}
            <div className="glass-card p-8 space-y-6">
              <h3 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
                <Award className="text-secondary" size={20} />
                Extracurricular Scores
              </h3>
              <div className="space-y-6 pt-4">
                {extracurricular.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        {item.icon}
                        {item.label}
                      </div>
                      <span className="text-xs font-bold text-muted">{item.score}/10</span>
                    </div>
                    <div className="h-2 bg-muted/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score * 10}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={cn("h-full rounded-full", item.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Topic Heatmap */}
          <div className="glass-card p-8 space-y-6">
            <h3 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
              <Target className="text-accent" size={20} />
              Topic Mastery Heatmap
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {topics.map((topic, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-muted/5 border border-muted/10 space-y-2">
                  <p className="text-xs font-bold text-muted truncate">{topic.name}</p>
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-lg font-heading font-bold",
                      topic.score > 80 ? "text-success" : topic.score > 60 ? "text-secondary" : "text-danger"
                    )}>
                      {topic.score}%
                    </span>
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      topic.score > 80 ? "bg-success" : topic.score > 60 ? "bg-secondary" : "bg-danger"
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doubt History */}
          <div className="glass-card p-8 space-y-6">
            <h3 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
              <MessageSquare className="text-primary" size={20} />
              Doubt History
            </h3>
            <div className="space-y-4">
              {[
                { q: "Why do we flip the second fraction when dividing?", a: "Dividing by a fraction is the same as multiplying by its reciprocal. Think of it as sharing parts of parts!", status: 'Resolved' },
                { q: "Can a denominator be zero?", a: "No, dividing by zero is undefined because you can't divide something into zero equal parts.", status: 'Resolved' },
                { q: "What is the difference between a proper and improper fraction?", a: "Waiting for teacher response...", status: 'Pending' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-muted/5 border border-muted/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-primary leading-tight">Q: {item.q}</p>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      item.status === 'Resolved' ? "bg-success/10 text-success" : "bg-secondary/10 text-secondary"
                    )}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted italic">A: {item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
