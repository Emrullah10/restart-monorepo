import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@store/themeStore';
import styles from './ThemeToggle.module.scss';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggleBtn}
      title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
