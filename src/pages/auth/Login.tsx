import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Users, Heart, ArrowRight, Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn, redirectByRole, UserRole } from '@/src/lib/auth';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await signIn(email, password);
      if (data.user) {
        setUser(data.user.id);
        setProfile(data.user);
        // Redirect based on the actual profile role
        navigate(redirectByRole(data.user.role));
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1000px] bg-white rounded-[2rem] sm:rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden flex min-h-[600px]"
      >
        {/* Left Side: Form */}
        <div className="flex-1 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-[#00C9A7] rounded-2xl flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black text-[#00C9A7] tracking-tight">EPISTEM</span>
            </div>
            <h1 className="text-3xl font-black text-[#1A1A2E] mb-2">Welcome Back!</h1>
            <p className="text-slate-500">Log in to your learning adventure.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selector */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
              <RoleButton 
                active={role === 'student'} 
                onClick={() => setRole('student')}
                icon={<GraduationCap size={24} />}
                label="Student"
              />
              <RoleButton 
                active={role === 'teacher'} 
                onClick={() => setRole('teacher')}
                icon={<Users size={24} />}
                label="Teacher"
              />
              <RoleButton 
                active={role === 'parent'} 
                onClick={() => setRole('parent')}
                icon={<Heart size={24} />}
                label="Parent"
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 500, damping: 15 } }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Fields */}
            <div className="space-y-4">
              <FloatingInput 
                label="Email Address" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={20} />}
                required
              />
              <FloatingInput 
                label="Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={20} />}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input type="checkbox" className="rounded-lg border-slate-200 text-[#00C9A7] focus:ring-[#00C9A7]" />
                Remember me
              </label>
              <a href="#" className="text-[#00C9A7] font-bold hover:underline">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#00C9A7] text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-[#00C9A7]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Log In'}
              {!isLoading && <ArrowRight size={20} />}
            </button>

            <p className="text-center text-slate-500 text-sm">
              Don't have an account? <Link to="/signup" className="text-[#00C9A7] font-bold hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden lg:flex flex-1 bg-[#00C9A7]/5 items-center justify-center p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="10" cy="10" r="2" fill="#00C9A7" />
              <circle cx="90" cy="20" r="3" fill="#FFB830" />
              <circle cx="30" cy="80" r="1.5" fill="#4FACFE" />
              <circle cx="70" cy="90" r="2.5" fill="#00C9A7" />
            </svg>
          </div>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 text-center"
          >
            <div className="w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center mb-8 mx-auto relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <GraduationCap size={120} className="text-[#00C9A7]" />
              </motion.div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#FFB830] rounded-2xl flex items-center justify-center shadow-lg rotate-12">
                <Sparkles className="text-white" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-[#1A1A2E] mb-4">Unlock Your Potential</h2>
            <p className="text-slate-600 max-w-xs mx-auto">Join thousands of students on the path to mastery with AI-powered learning.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function RoleButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
        active 
          ? 'border-[#00C9A7] bg-[#00C9A7]/5 text-[#00C9A7]' 
          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
      }`}
    >
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      {active && (
        <motion.div 
          layoutId="role-active" 
          className="w-2 h-2 bg-[#00C9A7] rounded-full mt-1" 
        />
      )}
    </button>
  );
}

function FloatingInput({ label, icon, ...props }: { label: string, icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = props.value !== '';

  return (
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? 'text-[#00C9A7]' : 'text-slate-400'}`}>
        {icon}
      </div>
      <input
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all focus:border-[#00C9A7] focus:bg-white text-[#1A1A2E] font-medium placeholder:text-transparent`}
      />
      <label 
        className={`absolute left-12 transition-all pointer-events-none ${
          isFocused || hasValue 
            ? 'top-2 text-[10px] uppercase font-bold text-[#00C9A7]' 
            : 'top-1/2 -translate-y-1/2 text-slate-400'
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function Sparkles({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
