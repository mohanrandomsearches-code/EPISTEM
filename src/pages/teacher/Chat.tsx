import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Clock,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, streamTeacherChat } from '@/src/lib/ai/teacher-chat';

const QUICK_PROMPTS = [
  { id: 'q1', text: "Who needs help now?", icon: <AlertTriangle size={18} className="text-red-500" /> },
  { id: 'q2', text: "Suggest today's lesson focus", icon: <Lightbulb size={18} className="text-amber-500" /> },
  { id: 'q3', text: "Explain most common errors", icon: <HelpCircle size={18} className="text-blue-500" /> },
  { id: 'q4', text: "Draft this week's agenda", icon: <Calendar size={18} className="text-emerald-500" /> },
  { id: 'q5', text: "Parent communication tips", icon: <MessageSquare size={18} className="text-indigo-500" /> },
];

export default function TeacherChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('teacher_chat_history');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // Initial greeting
      const greeting: ChatMessage = {
        role: 'model',
        text: "Hello, Ms. Sharma! I'm EduPersona, your AI co-teacher. I've analyzed your class data. How can I help you today?",
        timestamp: Date.now()
      };
      setMessages([greeting]);
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('teacher_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: text.trim(),
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    try {
      let fullResponse = "";
      const modelMessage: ChatMessage = {
        role: 'model',
        text: "",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, modelMessage]);

      const stream = streamTeacherChat(newMessages);
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: fullResponse
          };
          return updated;
        });
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: `Error: ${error.message || 'Failed to generate response'}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear this chat?')) {
      const greeting: ChatMessage = {
        role: 'model',
        text: "Chat cleared. How can I help you today?",
        timestamp: Date.now()
      };
      setMessages([greeting]);
      localStorage.removeItem('teacher_chat_history');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-8">
      {/* Chat Area (60%) */}
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Chat Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1A1A2E] tracking-tight">EduPersona AI</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Co-Teacher Online</span>
              </div>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#00C9A7] text-white' 
                  : 'bg-violet-100 text-violet-600'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`p-5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#00C9A7] text-white rounded-tr-none' 
                    : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  <div className="prose prose-sm max-w-none prose-slate">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={10} />
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isStreaming && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/30">
          <div className="relative bg-white border-2 border-slate-100 rounded-[2rem] focus-within:border-[#00C9A7] transition-all p-2 flex items-end gap-2">
            <textarea 
              ref={textareaRef}
              rows={1}
              placeholder="Ask about student performance, lesson plans, or class insights..."
              className="flex-1 px-6 py-3 outline-none resize-none bg-transparent text-slate-700 text-sm max-h-32"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center gap-2 pr-2 pb-2">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                {input.length} chars
              </span>
              <button 
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isStreaming}
                className="w-12 h-12 bg-[#00C9A7] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#00C9A7]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center uppercase font-bold tracking-widest">
            Enter to send • Shift + Enter for newline • EduPersona uses real class data
          </p>
        </div>
      </div>

      {/* Quick Prompts Panel (40%) */}
      <div className="lg:w-[400px] space-y-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-[#1A1A2E] mb-6 flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={24} />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handleSendMessage(prompt.text)}
                disabled={isStreaming}
                className="w-full text-left p-5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl transition-all flex items-center justify-between group disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {prompt.icon}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{prompt.text}</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
          <h3 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-2">
            <Bot size={20} />
            EduPersona Tip
          </h3>
          <p className="text-indigo-700 text-sm leading-relaxed">
            "I've noticed that <strong>Arjun</strong> and <strong>Sneha</strong> are struggling with the same Geometry concepts. Try grouping them for a peer-learning session today!"
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-4">Class Context</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Students Processed</span>
              <span className="text-sm font-black text-slate-700">32/32</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">AI Reports Ready</span>
              <span className="text-sm font-black text-slate-700">100%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Last Data Sync</span>
              <span className="text-sm font-black text-slate-700">2 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
