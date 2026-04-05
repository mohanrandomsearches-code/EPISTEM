import { supabase } from './lib/supabase';
import { UserRole } from './lib/auth';

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = ['/', '/login', '/signup', '/demo'];

/**
 * Checks if a path is protected and if the user has the correct role
 */
export const validateRouteAccess = (path: string, user: any, profile: any): { 
  allowed: boolean; 
  redirect?: string; 
} => {
  // 1. If it's a public route, always allow
  if (PUBLIC_ROUTES.includes(path)) {
    return { allowed: true };
  }

  // 2. If not authenticated, redirect to login
  if (!user) {
    return { allowed: false, redirect: '/login' };
  }

  // 3. Role-based protection for dashboard routes
  if (path.startsWith('/student') && profile?.role !== 'student') {
    return { allowed: false, redirect: profile ? `/${profile.role}` : '/login' };
  }
  
  if (path.startsWith('/teacher') && profile?.role !== 'teacher') {
    return { allowed: false, redirect: profile ? `/${profile.role}` : '/login' };
  }
  
  if (path.startsWith('/parent') && profile?.role !== 'parent') {
    return { allowed: false, redirect: profile ? `/${profile.role}` : '/login' };
  }

  return { allowed: true };
};

export const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
