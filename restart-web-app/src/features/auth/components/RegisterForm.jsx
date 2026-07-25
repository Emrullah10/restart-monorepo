import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuthTextField from '@components/AuthTextField/AuthTextField';
import GradientButton from '@components/GradientButton/GradientButton';
import { authApi } from '@api/auth.api';
import { useAuthStore } from '@store/authStore';
import styles from './RegisterForm.module.scss';

export const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg('Lütfen tüm alanları doldurun.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Şifreler eşleşmiyor.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const data = await authApi.register(email, password, fullName);
      setUser(data.user || data);
      navigate('/');
    } catch (err) {
      const cleanError = err.response?.data?.error || err.message || 'Kayıt yapılamadı';
      setErrorMsg(cleanError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.textHeader}>
        <h2 className={styles.title}>{t('registerTitle')}</h2>
        <p className={styles.subtitle}>{t('registerSubtitle')}</p>
      </div>

      {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <AuthTextField
          icon={User}
          placeholder={t('nameHint')}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

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

        <AuthTextField
          icon={Lock}
          isPassword
          placeholder={t('passwordConfirmHint')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <GradientButton type="submit" isLoading={loading} fullWidth>
          {t('registerButton')}
        </GradientButton>
      </form>

      <div className={styles.footerLink}>
        <span>{t('haveAccount')}</span>
        <Link to="/login" className={styles.linkAccent}>
          {t('loginButton')}
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
