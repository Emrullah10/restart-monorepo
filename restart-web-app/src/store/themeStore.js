import { create } from 'zustand';

const getInitialTheme = () => {
  const saved = localStorage.getItem('restart_theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('restart_theme', nextTheme);
    document.body.setAttribute('data-theme', nextTheme);
    set({ theme: nextTheme });
  },
  initTheme: () => {
    const currentTheme = get().theme;
    document.body.setAttribute('data-theme', currentTheme);
  }
}));
