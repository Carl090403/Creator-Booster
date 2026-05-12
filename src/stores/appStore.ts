
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Platform } from '../types';

interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setAuthenticated: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearUser: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      setLoading: (status) => set({ isLoading: status }),
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'creator-booster-storage',
    }
  )
);
