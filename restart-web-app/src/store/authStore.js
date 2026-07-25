import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => set({ user, isInitialized: true }),
  logout: () => set({ user: null, isInitialized: true })
}));
