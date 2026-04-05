import React, { useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, LayoutDashboard, MessageSquare, User, LogOut, Sparkles, AlertCircle, Settings, Users, Upload, Bot, FileText, Award, Calendar } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';
import { UserProfile, signOut, getCurrentUser } from './lib/auth';

// Pages
import LoginPage from './pages/auth/Login';
import SignupPage from './pages/auth/Signup';
import StudentDashboard from './pages/student/Dashboard';
import TopicsBrowser from './pages/student/Topics';
import TopicDetail from './pages/student/TopicDetail';
import PracticeMode from './pages/student/PracticeMode';
import TeacherDashboard from './pages/teacher/Dashboard';
import ClassOverview from './pages/teacher/ClassOverview';
import StudentDetail from './pages/teacher/StudentDetail';
import UploadExcel from './pages/teacher/UploadExcel';
import TeacherReports from './pages/teacher/Reports';
import TeacherChat from './pages/teacher/Chat';
import TeacherDoubts from './pages/teacher/Doubts';
import TeacherAgenda from './pages/teacher/Agenda';
import ParentDashboard from './pages/parent/Dashboard';
import ParentDetailedReport from './pages/parent/DetailedReport';
import ParentSettings from './pages/parent/Settings';
import StudentMyReport from './pages/student/MyReport';
import StudentDoubts from './pages/student/Doubts';
import PsychometricTest from './pages/student/onboarding/PsychometricTest';
import { AuthSkeleton } from './components/AuthSkeleton';
import { ChatWidget } from './components/ChatWidget';

const queryClient = new QueryClient();

// --- Error Boundary ---
interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="glass-card p-8 max-w-md w-full text-center">
            <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
            <h2 className="text-2xl mb-2">Something went wrong</h2>
            <p className="text-muted mb-6">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

// --- Protected Route Wrapper ---
function ProtectedRoute({ children, allowedRoles }: { children: ReactNode, allowedRoles?: string[] }) {
  const { user, profile, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <AuthSkeleton />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Redirect to their own dashboard if they try to access wrong role path
    const dashboard = `/${profile.role}`;
    return <Navigate to={dashboard} replace />;
  }

  // Psychometric Gate for students
  if (profile?.role === 'student' && !profile.psychometric_completed && !location.pathname.startsWith('/student/onboarding')) {
    return <Navigate to="/student/onboarding/psychometric" replace />;
  }

  return <>{children}</>;
}

// --- Main Dashboard Component ---
function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, profile } = useAuthStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-muted/20 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-heading font-bold text-primary tracking-tight">EPISTEM</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {profile?.role === 'student' ? (
            <>
              <NavLink 
                to="/student" 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
                active={location.pathname === '/student'} 
              />
              <NavLink 
                to="/student/topics" 
                icon={<BookOpen size={20} />} 
                label="Learning" 
                active={location.pathname.startsWith('/student/topics')} 
              />
              <NavLink 
                to="/student/my-report" 
                icon={<FileText size={20} />} 
                label="My Report" 
                active={location.pathname === '/student/my-report'} 
              />
              <NavLink 
                to="/student/doubts" 
                icon={<MessageSquare size={20} />} 
                label="Doubts" 
                active={location.pathname === '/student/doubts'} 
              />
            </>
          ) : profile?.role === 'teacher' ? (
            <>
              <NavLink 
                to="/teacher" 
                icon={<LayoutDashboard size={20} />} 
                label="Home" 
                active={location.pathname === '/teacher'} 
              />
              <NavLink 
                to="/teacher/class" 
                icon={<Users size={20} />} 
                label="My Class" 
                active={location.pathname.startsWith('/teacher/class') || location.pathname.startsWith('/teacher/students')} 
              />
              <NavLink 
                to="/teacher/upload" 
                icon={<Upload size={20} />} 
                label="Upload" 
                active={location.pathname === '/teacher/upload'} 
              />
              <NavLink 
                to="/teacher/doubts" 
                icon={<MessageSquare size={20} />} 
                label="Doubts" 
                active={location.pathname === '/teacher/doubts'} 
              />
              <NavLink 
                to="/teacher/agenda" 
                icon={<Calendar size={20} />} 
                label="Agenda" 
                active={location.pathname === '/teacher/agenda'} 
              />
              <NavLink 
                to="/teacher/reports" 
                icon={<Sparkles size={20} />} 
                label="AI Reports" 
                active={location.pathname === '/teacher/reports'} 
              />
              <NavLink 
                to="/teacher/chat" 
                icon={<Bot size={20} />} 
                label="AI Assistant" 
                active={location.pathname === '/teacher/chat'} 
              />
            </>
          ) : profile?.role === 'parent' ? (
            <>
              <NavLink 
                to="/parent" 
                icon={<LayoutDashboard size={20} />} 
                label="Home" 
                active={location.pathname === '/parent'} 
              />
              <NavLink 
                to="/parent/report" 
                icon={<Award size={20} />} 
                label="Detailed Report" 
                active={location.pathname === '/parent/report'} 
              />
              <NavLink 
                to="/parent/settings" 
                icon={<Settings size={20} />} 
                label="Settings" 
                active={location.pathname === '/parent/settings'} 
              />
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-muted/10 px-3 py-1.5 rounded-2xl">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                {profile?.name?.[0] || 'U'}
              </div>
              <span className="font-medium text-sm hidden sm:block">{profile?.name || 'User'}</span>
              <button 
                onClick={() => {
                  signOut();
                  window.location.href = '/login';
                }}
                className="text-muted hover:text-danger transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Navigate to="/login" />
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 relative">
        {children}
        
        {/* Floating AI Assistant for Teachers */}
        {profile?.role === 'teacher' && location.pathname !== '/teacher/chat' && (
          <ChatWidget />
        )}
      </main>
    </div>
  );
}

function EpistemApp() {
  const { setUser, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getCurrentUser();
        if (data) {
          setUser(data.id);
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setProfile, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/student/topics" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <TopicsBrowser />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/student/topics/:topicId" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <TopicDetail />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/student/my-report" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <StudentMyReport />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/student/doubts" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <StudentDoubts />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/student/onboarding/psychometric" element={
          <ProtectedRoute allowedRoles={['student']}>
            <PsychometricTest />
          </ProtectedRoute>
        } />
        
        <Route path="/student/practice/:topicId" element={
          <ProtectedRoute allowedRoles={['student']}>
            <PracticeMode />
          </ProtectedRoute>
        } />
        
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <TeacherDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/class" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <ClassOverview />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/students/:id" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <StudentDetail />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/upload" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <UploadExcel />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/reports" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <TeacherReports />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/doubts" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <TeacherDoubts />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/agenda" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <TeacherAgenda />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/chat" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <TeacherChat />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/parent" element={
          <ProtectedRoute allowedRoles={['parent']}>
            <DashboardLayout>
              <ParentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/parent/report" element={
          <ProtectedRoute allowedRoles={['parent']}>
            <DashboardLayout>
              <ParentDetailedReport />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/parent/settings" element={
          <ProtectedRoute allowedRoles={['parent']}>
            <DashboardLayout>
              <ParentSettings />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <EpistemApp />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// --- Helper Components ---
function NavLink({ to, icon, label, active = false }: { to: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link to={to} className={`flex items-center gap-2 font-medium transition-colors relative ${active ? 'text-primary' : 'text-muted hover:text-primary'}`}>
      {icon}
      <span>{label}</span>
      {active && <motion.div layoutId="nav-active" className="absolute -bottom-[25px] h-1 w-full bg-primary rounded-t-full" />}
    </Link>
  );
}

