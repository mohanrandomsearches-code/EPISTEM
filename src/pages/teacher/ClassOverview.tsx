
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  MoreVertical, 
  FileText, 
  Mail, 
  AlertCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

type RiskLevel = 'On Track' | 'Needs Attention' | 'At Risk';

interface Student {
  id: string;
  name: string;
  rollNo: string;
  avgScore: number;
  accuracy: number;
  weakTopics: string[];
  risk: RiskLevel;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Rahul Sharma', rollNo: '6A01', avgScore: 82, accuracy: 85, weakTopics: ['Fractions', 'Decimals'], risk: 'On Track' },
  { id: '2', name: 'Ananya Patel', rollNo: '6A02', avgScore: 65, accuracy: 62, weakTopics: ['Geometry', 'Algebra'], risk: 'Needs Attention' },
  { id: '3', name: 'Vikram Kumar', rollNo: '6A03', avgScore: 45, accuracy: 48, weakTopics: ['Multiplication', 'Division'], risk: 'At Risk' },
  { id: '4', name: 'Priya Singh', rollNo: '6A04', avgScore: 92, accuracy: 95, weakTopics: ['None'], risk: 'On Track' },
  { id: '5', name: 'Siddharth Rao', rollNo: '6A05', avgScore: 72, accuracy: 75, weakTopics: ['Ratios'], risk: 'On Track' },
  { id: '6', name: 'Ishita Gupta', rollNo: '6A06', avgScore: 58, accuracy: 55, weakTopics: ['Fractions'], risk: 'Needs Attention' },
];

export default function ClassOverview() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<RiskLevel | 'All'>('All');
  const [sortField, setSortField] = useState<keyof Student>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const toggleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredStudents = mockStudents
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => filter === 'All' || s.risk === filter)
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

  const toggleSelect = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Class Overview</h1>
          <p className="text-muted">Grade 6 - Section A (32 Students)</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="btn-secondary flex-1 md:flex-none flex items-center justify-center gap-2">
            <Mail size={18} />
            Email Parents
          </button>
          <button className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2">
            <FileText size={18} />
            Generate Reports
          </button>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by student name..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/5 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {(['All', 'At Risk', 'Needs Attention', 'On Track'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                filter === f ? "bg-primary text-white shadow-md" : "bg-muted/5 text-muted hover:bg-muted/10"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedStudents.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center justify-between"
        >
          <span className="text-sm font-bold text-primary">{selectedStudents.length} Students Selected</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform">
              Generate Reports for Selected
            </button>
            <button 
              onClick={() => setSelectedStudents([])}
              className="px-4 py-2 bg-white text-muted rounded-xl text-xs font-bold border border-muted/20 hover:bg-muted/5"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/5 border-b border-muted/10">
                <th className="p-5 w-12">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-muted/30 text-primary focus:ring-primary/20"
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-5 text-xs font-bold text-muted uppercase tracking-widest cursor-pointer group" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-2">
                    Name
                    {sortField === 'name' ? (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ChevronDown size={14} className="opacity-0 group-hover:opacity-50" />}
                  </div>
                </th>
                <th className="p-5 text-xs font-bold text-muted uppercase tracking-widest">Roll No</th>
                <th className="p-5 text-xs font-bold text-muted uppercase tracking-widest cursor-pointer group" onClick={() => toggleSort('avgScore')}>
                  <div className="flex items-center gap-2">
                    Avg Score
                    {sortField === 'avgScore' ? (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ChevronDown size={14} className="opacity-0 group-hover:opacity-50" />}
                  </div>
                </th>
                <th className="p-5 text-xs font-bold text-muted uppercase tracking-widest cursor-pointer group" onClick={() => toggleSort('accuracy')}>
                  <div className="flex items-center gap-2">
                    Accuracy
                    {sortField === 'accuracy' ? (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ChevronDown size={14} className="opacity-0 group-hover:opacity-50" />}
                  </div>
                </th>
                <th className="p-5 text-xs font-bold text-muted uppercase tracking-widest">Weak Topics</th>
                <th className="p-5 text-xs font-bold text-muted uppercase tracking-widest">Risk</th>
                <th className="p-5 text-xs font-bold text-muted uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {filteredStudents.map((student, idx) => (
                <tr 
                  key={student.id} 
                  className={cn(
                    "hover:bg-primary/5 transition-colors cursor-pointer group",
                    idx % 2 === 1 ? "bg-[#F7F9FC]" : "bg-white"
                  )}
                  onClick={() => navigate(`/teacher/students/${student.id}`)}
                >
                  <td className="p-5" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-muted/30 text-primary focus:ring-primary/20"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleSelect(student.id)}
                    />
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-bold text-primary">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-5 text-sm font-medium text-muted">{student.rollNo}</td>
                  <td className="p-5">
                    <span className="font-bold text-primary">{student.avgScore}%</span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted/10 rounded-full w-16">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            student.accuracy > 80 ? "bg-success" : student.accuracy > 60 ? "bg-secondary" : "bg-danger"
                          )}
                          style={{ width: `${student.accuracy}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-muted">{student.accuracy}%</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-wrap gap-1">
                      {student.weakTopics.map((topic, i) => (
                        <span key={i} className="px-2 py-0.5 bg-muted/5 text-muted text-[10px] font-bold rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit",
                      student.risk === 'On Track' ? "bg-success/10 text-success" : 
                      student.risk === 'Needs Attention' ? "bg-secondary/10 text-secondary" : 
                      "bg-danger/10 text-danger"
                    )}>
                      {student.risk === 'On Track' ? <CheckCircle2 size={12} /> : 
                       student.risk === 'Needs Attention' ? <AlertTriangle size={12} /> : 
                       <AlertCircle size={12} />}
                      {student.risk}
                    </span>
                  </td>
                  <td className="p-5" onClick={(e) => e.stopPropagation()}>
                    <button className="p-2 hover:bg-muted/10 rounded-lg transition-colors text-muted">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-muted/5 rounded-full flex items-center justify-center mx-auto">
              <Search size={32} className="text-muted/30" />
            </div>
            <p className="text-muted font-medium">No students found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
