import { motion } from 'motion/react';

export const AuthSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] p-6">
      <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex min-h-[600px]">
        {/* Left Side (Form Area) */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="w-32 h-8 bg-slate-100 rounded-full mb-8 animate-pulse" />
          <div className="w-48 h-10 bg-slate-100 rounded-xl mb-4 animate-pulse" />
          <div className="w-full h-4 bg-slate-100 rounded-full mb-12 animate-pulse" />
          
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
          
          <div className="space-y-6">
            <div className="w-full h-14 bg-slate-50 rounded-2xl animate-pulse" />
            <div className="w-full h-14 bg-slate-50 rounded-2xl animate-pulse" />
            <div className="w-full h-14 bg-[#00C9A7]/20 rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Right Side (Illustration Area) */}
        <div className="hidden lg:flex flex-1 bg-[#00C9A7]/5 items-center justify-center p-12">
          <div className="w-64 h-64 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
