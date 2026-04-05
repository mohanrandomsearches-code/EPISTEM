import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  Mail, 
  User, 
  Shield, 
  ChevronRight, 
  Check, 
  Clock, 
  Calendar, 
  MessageCircle,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function ParentSettings() {
  const { logout } = useAuthStore();
  const [emailDigest, setEmailDigest] = useState(true);
  const [notifications, setNotifications] = useState({
    reportReady: true,
    weeklySummary: true,
    teacherReply: true
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
            <SettingsIcon className="text-slate-600" size={28} />
          </div>
          Settings
        </h1>
        <button 
          onClick={logout}
          className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-red-100 transition-colors"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Column: Profile & Account */}
        <div className="md:col-span-1 space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center space-y-6">
            <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
              <span className="text-4xl font-black text-violet-600">P</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-[#1A1A2E]">Priya's Parents</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Primary Account</p>
            </div>
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-left">
                <User className="text-slate-400" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Child's Name</p>
                  <p className="text-sm font-bold text-slate-700">Priya Sharma</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-left">
                <Calendar className="text-slate-400" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grade</p>
                  <p className="text-sm font-bold text-slate-700">6A (2025-26)</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 space-y-4">
            <h4 className="text-lg font-black text-emerald-900 flex items-center gap-2">
              <Shield size={20} />
              Security Check
            </h4>
            <p className="text-sm text-emerald-700 font-medium leading-relaxed">
              Your account is secured with Google Login. No password required!
            </p>
          </section>
        </div>

        {/* Right Column: Preferences */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-10">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#1A1A2E] flex items-center gap-2">
                    <Mail className="text-violet-500" size={24} />
                    Weekly Email Digest
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">Get a summary of Priya's progress every Monday morning.</p>
                </div>
                <button 
                  onClick={() => setEmailDigest(!emailDigest)}
                  className={`w-14 h-8 rounded-full transition-colors relative ${emailDigest ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                  <motion.div 
                    animate={{ x: emailDigest ? 24 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-6">
                <h3 className="text-xl font-black text-[#1A1A2E] flex items-center gap-2">
                  <Bell className="text-amber-500" size={24} />
                  Notification Preferences
                </h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'reportReady', label: 'New Report Ready', icon: <Calendar size={18} /> },
                    { key: 'weeklySummary', label: 'Weekly Summary', icon: <Clock size={18} /> },
                    { key: 'teacherReply', label: 'Teacher Reply', icon: <MessageCircle size={18} /> }
                  ].map((pref) => (
                    <div 
                      key={pref.key}
                      onClick={() => toggleNotification(pref.key as keyof typeof notifications)}
                      className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <div className="text-slate-400">{pref.icon}</div>
                        </div>
                        <span className="font-bold text-slate-700">{pref.label}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        notifications[pref.key as keyof typeof notifications] ? 'bg-emerald-500 text-white' : 'bg-slate-200'
                      }`}>
                        {notifications[pref.key as keyof typeof notifications] && <Check size={14} strokeWidth={4} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full py-5 bg-[#1A1A2E] text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all">
                Save Preferences
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
