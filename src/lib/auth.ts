
export type UserRole = 'student' | 'teacher' | 'parent';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  grade?: number;
  class_id?: string;
  avatar_url?: string;
  psychometric_completed?: boolean;
  psychometric_completed_at?: string;
}

const HARDCODED_USERS = [
  {
    email: 'student@epistem.com',
    password: 'password123',
    profile: {
      id: 's1',
      role: 'student' as UserRole,
      name: 'Rahul Student',
      grade: 6,
      avatar_url: 'RS',
      psychometric_completed: false
    }
  },
  {
    email: 'teacher@epistem.com',
    password: 'password123',
    profile: {
      id: 't1',
      role: 'teacher' as UserRole,
      name: 'Ms. Sharma',
      avatar_url: 'AS'
    }
  },
  {
    email: 'parent@epistem.com',
    password: 'password123',
    profile: {
      id: 'p1',
      role: 'parent' as UserRole,
      name: 'Mr. Sharma',
      avatar_url: 'MS'
    }
  }
];

export const signIn = async (email: string, password: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = HARDCODED_USERS.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Persist to localStorage for MVP persistence
  localStorage.setItem('epistem_user', JSON.stringify(user.profile));
  
  return { user: user.profile };
};

export const signUp = async (data: any) => {
  // Mock signup
  await new Promise(resolve => setTimeout(resolve, 800));
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    ...data
  };
  localStorage.setItem('epistem_user', JSON.stringify(newUser));
  return { user: newUser };
};

export const signOut = async () => {
  localStorage.removeItem('epistem_user');
};

export const getCurrentUser = async () => {
  const stored = localStorage.getItem('epistem_user');
  if (!stored) return null;
  const profile = JSON.parse(stored);
  return { id: profile.id, profile };
};

export const redirectByRole = (role: UserRole) => {
  switch (role) {
    case 'student': return '/student';
    case 'teacher': return '/teacher';
    case 'parent': return '/parent';
    default: return '/';
  }
};
