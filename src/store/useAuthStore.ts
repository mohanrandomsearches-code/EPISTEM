import { create } from 'zustand';
import { UserProfile, signOut } from '@/src/lib/auth';

interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    await signOut();
    set({ user: null, profile: null });
  },
}));
