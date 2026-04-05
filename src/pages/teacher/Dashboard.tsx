
import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  AlertTriangle, 
  BookOpen, 
  MessageSquare, 
  Upload, 
  FileText, 
  Bot, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  const metrics = [
    { label: 'Class Average %', value: '78.5%', icon: <BookOpen className="text-primary" />, trend: '+2.4%', up: true },
    { label: 'Students At Risk', value: '4', icon: <AlertTriangle className="text-danger" />, trend: '-1', up: false },
    { label: 'Topics Covered', value: '12', icon: <Users className="text-accent" />, trend: '+2', up: true },
    { label: 'Doubts Pending', value: '8', icon: <MessageSquare className="text-secondary" />, trend: '+3', up: true },
  ];

  const alerts = [
    { name: 'Rahul S.', drop: '18%', topic: 'Fractions', avatar: 'RS' },
    { name: 'Ananya P.', drop: '22%', topic: 'Decimals', avatar: 'AP' },
    { name: 'Vikram K.', drop: '16%', topic: 'Geometry', avatar: 'VK' },
  ];

  const agenda = [
    { time: '10:00 AM', task: 'Grade 6 Math - Fractions Quiz', type: 'Class' },
    { time: '11:30 AM', task: 'Parent-Teacher Meeting (Rahul S.)', type: 'Meeting' },
    { time: '02:00 PM', task: 'Curriculum Planning - Algebra', type: 'Planning' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Good morning, Ms. Sharma!</h1>
          <p className="text-muted">Here's what's happening in your classes today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/teacher/upload" className="btn-secondary flex items-center gap-2">
            <Upload size={18} />
            Upload Excel
          </Link>
          <button className="btn-primary flex items-center gap-2">
            <FileText size={18} />
            Generate All Reports
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-2xl bg-muted/5">
                {m.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${m.up ? 'text-success' : 'text-danger'}`}>
                {m.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {m.trend}
              </div>
            </div>
            <div>
              <h4 className="text-3xl font-heading font-bold text-primary">{m.value}</h4>
              <p className="text-sm text-muted font-medium">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
              <AlertTriangle className="text-danger" size={20} />
              Performance Alerts
            </h3>
            <Link to="/teacher/class" className="text-sm font-bold text-accent hover:underline">View All Students</Link>
          </div>
          <div className="space-y-4">
            {alerts.map((alert, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="glass-card p-4 flex items-center justify-between border-l-4 border-l-danger"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-danger/10 text-danger flex items-center justify-center font-bold">
                    {alert.avatar}
                  </div>
                  <div>
                    <h5 className="font-bold text-primary">{alert.name}</h5>
                    <p className="text-xs text-muted">Dropped in <span className="font-bold">{alert.topic}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-danger/10 text-danger px-3 py-1 rounded-full text-xs font-bold">
                    -{alert.drop} Accuracy
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <button className="glass-card p-4 flex flex-col items-center gap-3 hover:bg-primary/5 transition-colors group">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <span className="text-xs font-bold text-muted">Upload Excel</span>
            </button>
            <button className="glass-card p-4 flex flex-col items-center gap-3 hover:bg-accent/5 transition-colors group">
              <div className="p-3 rounded-2xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <span className="text-xs font-bold text-muted">Reports</span>
            </button>
            <Link to="/teacher/chat" className="glass-card p-4 flex flex-col items-center gap-3 hover:bg-ai-purple/5 transition-colors group">
              <div className="p-3 rounded-2xl bg-ai-purple/10 text-ai-purple group-hover:scale-110 transition-transform">
                <Bot size={24} />
              </div>
              <span className="text-xs font-bold text-muted">AI Chat</span>
            </Link>
            <button className="glass-card p-4 flex flex-col items-center gap-3 hover:bg-secondary/5 transition-colors group">
              <div className="p-3 rounded-2xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <span className="text-xs font-bold text-muted">Plan Agenda</span>
            </button>
          </div>
        </div>

        {/* Agenda Preview & AI Assistant */}
        <div className="space-y-8">
          {/* AI Assistant Card */}
          <div className="bg-gradient-to-br from-ai-purple to-[#8E2DE2] p-8 rounded-[2.5rem] text-white shadow-xl shadow-ai-purple/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">EduPersona AI</h3>
                <p className="text-white/80 text-sm leading-relaxed">Your AI co-teacher is ready to help with lesson plans, student insights, and more.</p>
              </div>
              <Link 
                to="/teacher/chat" 
                className="inline-flex items-center gap-2 bg-white text-ai-purple px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Start Chatting
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
              <Clock className="text-accent" size={20} />
              Today's Agenda
            </h3>
            <div className="glass-card overflow-hidden">
              <div className="p-4 bg-muted/5 border-b border-muted/10">
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Saturday, April 4</p>
              </div>
              <div className="divide-y divide-muted/10">
                {agenda.map((item, idx) => (
                  <div key={idx} className="p-4 hover:bg-muted/5 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-accent">{item.time}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.type === 'Class' ? 'bg-primary/10 text-primary' : 
                        item.type === 'Meeting' ? 'bg-secondary/10 text-secondary' : 
                        'bg-accent/10 text-accent'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-primary">{item.task}</h5>
                  </div>
                ))}
              </div>
              <Link to="/teacher/agenda" className="block w-full p-4 text-center text-sm font-bold text-primary hover:bg-muted/5 transition-colors border-t border-muted/10">
                View Full Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
