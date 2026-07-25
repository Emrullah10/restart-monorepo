import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Zap, Globe, Apple } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuthTextField from '@components/AuthTextField/AuthTextField';
import GradientButton from '@components/GradientButton/GradientButton';
import { authApi } from '@api/auth.api';
import { useAuthStore } from '@store/authStore';
import styles from './LoginForm.module.scss';

export const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const data = await authApi.login(email, password);
      setUser(data.user || data);
      navigate('/');
    } catch (err) {
      const cleanError = err.response?.data?.error || err.message || 'Giriş yapılamadı';
      setErrorMsg(cleanError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.iconHeader}>
        <div className={styles.zapBadge}>
          <Zap size={32} />
        </div>
      </div>

      <div className={styles.textHeader}>
        <h2 className={styles.title}>{t('loginWelcome')}</h2>
        <p className={styles.subtitle}>{t('loginSubtitle')}</p>
      </div>

      {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <AuthTextField
          icon={Mail}
          type="email"
          placeholder={t('emailHint')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthTextField
          icon={Lock}
          isPassword
          placeholder={t('passwordHint')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <GradientButton type="submit" isLoading={loading} fullWidth>
          {t('loginButton')}
        </GradientButton>
      </form>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>{t('orDivider')}</span>
        <span className={styles.dividerLine} />
      </div>

      <div className={styles.socialRow}>
        <button className={styles.socialBtn} type="button">
          <Globe size={20} />
        </button>
        <button className={styles.socialBtn} type="button">
          <Apple size={20} />
        </button>
      </div>

      <div className={styles.footerLink}>
        <span>{t('noAccount')}</span>
        <Link to="/register" className={styles.linkAccent}>
          {t('registerButton')}
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
