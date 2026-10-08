import { create } from 'zustand';

const KEY = 'teknolup_theme'; // 'light' | 'dark' | 'system'
const mq = () => window.matchMedia('(prefers-color-scheme: dark)');
const resolve = (pref) => (pref === 'system' ? (mq().matches ? 'dark' : 'light') : pref);
const read = () => { try { return localStorage.getItem(KEY) || 'system'; } catch { return 'system'; } };
const apply = (pref) => { document.documentElement.setAttribute('data-theme', resolve(pref)); };

export const useThemeStore = create((set, get) => ({
  preference: read(),
  theme: resolve(read()),
  setPreference: (pref) => {
    try { localStorage.setItem(KEY, pref); } catch { /* ignore */ }
    apply(pref);
    set({ preference: pref, theme: resolve(pref) });
  },
  toggleTheme: () => get().setPreference(get().theme === 'dark' ? 'light' : 'dark'),
  initTheme: () => {
    apply(get().preference);
    set({ theme: resolve(get().preference) });
    mq().addEventListener('change', () => {
      if (get().preference === 'system') { apply('system'); set({ theme: resolve('system') }); }
    });
  },
}));
