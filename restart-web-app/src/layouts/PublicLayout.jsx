import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Recycle } from 'lucide-react';
import ThemeToggle from '@components/ThemeToggle/ThemeToggle';
import LanguageToggle from '@components/LanguageToggle/LanguageToggle';
import GradientButton from '@components/GradientButton/GradientButton';
import styles from './PublicLayout.module.scss';

export const PublicLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <header className={styles.topBar}>
        <button className={styles.logoGroup} onClick={() => navigate('/pazar')}>
          <div className={styles.logoBadge}>
            <Recycle size={22} />
          </div>
          <span className={styles.logoText}>ReStart</span>
        </button>

        <div className={styles.actions}>
          <ThemeToggle />
          <LanguageToggle />
          <button className={styles.loginBtn} onClick={() => navigate('/login')}>
            Giriş Yap
          </button>
          <GradientButton onClick={() => navigate('/register')}>
            Kayıt Ol
          </GradientButton>
        </div>
      </header>

      <main className={styles.content}>
        {children ?? <Outlet />}
      </main>
    </div>
  );
};

export default PublicLayout;
