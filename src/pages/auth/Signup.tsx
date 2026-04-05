import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Users, Heart, ArrowRight, ArrowLeft, Loader2, Mail, Lock, User, School, Hash, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp, redirectByRole, UserRole } from '@/src/lib/auth';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuthStore();

  // Form State
  const [formData, setFormData] = useState({
    role: 'student' as UserRole,
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: '',
    classCode: '',
    schoolName: '',
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await signUp({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        name: formData.name,
        grade: formData.grade ? parseInt(formData.grade) : undefined,
        class_code: formData.classCode,
        school_name: formData.schoolName,
      });
      
      if (data.user) {
        setUser(data.user.id);
        setProfile(data.user);
        // Success! Redirect based on role
        navigate(redirectByRole(formData.role));
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[600px] bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#00C9A7] rounded-2xl flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black text-[#00C9A7] tracking-tight">EPISTEM</span>
            </div>
            <h1 className="text-2xl font-black text-[#1A1A2E]">Create your account</h1>
            <p className="text-slate-500 text-sm mt-1">Join the future of learning.</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                  step >= i ? 'bg-[#00C9A7] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > i ? <CheckCircle size={20} /> : i}
                  {step === i && (
                    <motion.div 
                      layoutId="step-ring"
                      className="absolute -inset-1 border-2 border-[#00C9A7] rounded-full"
                    />
                  )}
                </div>
                {i < 3 && (
                  <div className={`w-12 h-1 rounded-full transition-all ${
                    step > i ? 'bg-[#00C9A7]' : 'bg-slate-100'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={step === 3 ? handleSignup : (e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">I am a...</label>
                    <div className="grid grid-cols-3 gap-4">
                      <RoleCard 
                        active={formData.role === 'student'} 
                        onClick={() => updateFormData('role', 'student')}
                        icon={<GraduationCap size={24} />}
                        label="Student"
                      />
                      <RoleCard 
                        active={formData.role === 'teacher'} 
                        onClick={() => updateFormData('role', 'teacher')}
                        icon={<Users size={24} />}
                        label="Teacher"
                      />
                      <RoleCard 
                        active={formData.role === 'parent'} 
                        onClick={() => updateFormData('role', 'parent')}
                        icon={<Heart size={24} />}
                        label="Parent"
                      />
                    </div>
                  </div>

                  <FloatingInput 
                    label="Full Name" 
                    icon={<User size={20} />}
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    required
                  />

                  <button 
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.name}
                    className="w-full bg-[#00C9A7] text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-[#00C9A7]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Next Step <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <FloatingInput 
                      label="School Name" 
                      icon={<School size={20} />}
                      value={formData.schoolName}
                      onChange={(e) => updateFormData('schoolName', e.target.value)}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput 
                        label="Grade / Class" 
                        icon={<Hash size={20} />}
                        type="number"
                        min="1"
                        max="12"
                        value={formData.grade}
                        onChange={(e) => updateFormData('grade', e.target.value)}
                      />
                      {formData.role === 'student' && (
                        <FloatingInput 
                          label="Join Code" 
                          icon={<CheckCircle size={20} />}
                          value={formData.classCode}
                          onChange={(e) => updateFormData('classCode', e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={20} /> Back
                    </button>
                    <button 
                      type="button"
                      onClick={nextStep}
                      className="flex-[2] bg-[#00C9A7] text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-[#00C9A7]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Next Step <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-sm flex items-center gap-2">
                      <CheckCircle size={18} className="rotate-45" /> {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <FloatingInput 
                      label="Email Address" 
                      type="email"
                      icon={<Mail size={20} />}
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      required
                    />
                    <FloatingInput 
                      label="Create Password" 
                      type="password"
                      icon={<Lock size={20} />}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      required
                    />
                    <FloatingInput 
                      label="Confirm Password" 
                      type="password"
                      icon={<Lock size={20} />}
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="flex-[3] bg-[#00C9A7] text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-[#00C9A7]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                      {!isLoading && <ArrowRight size={20} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Already have an account? <Link to="/login" className="text-[#00C9A7] font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function RoleCard({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all gap-2 ${
        active 
          ? 'border-[#00C9A7] bg-[#00C9A7]/5 text-[#00C9A7]' 
          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
      }`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
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
