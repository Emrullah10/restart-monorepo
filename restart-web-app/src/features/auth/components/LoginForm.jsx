import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextField, Button } from '@components/ui';
import { authApi } from '@api/auth.api';
import { useAuthStore } from '@store/authStore';

export const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setErrorMsg(t('auth.fillAll')); return; }
    try {
      setLoading(true); setErrorMsg('');
      const data = await authApi.login(email, password);
      setUser(data.user || data);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || t('auth.loginFailed'));
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="mb-space-10">
        <h2 className="mb-space-2 font-heading-lg text-heading-lg text-fg">{t('auth.loginTitle')}</h2>
        <p className="font-body-md text-body-md text-fg-2">{t('auth.loginSubtitle')}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-space-6" noValidate>
        <TextField label={t('auth.email')} labelClass="text-fg" type="email" autoComplete="email" placeholder={t('auth.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} radius="r2" height="h-[52px]" />
        <TextField label={t('auth.password')} labelClass="text-fg" password autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} radius="r2" height="h-[52px]" />
        <div className="mt-space-2 flex items-center justify-between">
          <button type="button" onClick={() => setErrorMsg(t('common.comingSoon'))} className="font-label text-label text-accent hover:text-accent-hover">{t('auth.forgot')}</button>
        </div>
        {errorMsg && <p role="alert" className="font-caption text-caption text-danger">{errorMsg}</p>}
        <Button type="submit" disabled={loading} full radius="r2" className="h-[52px] py-space-3">{loading ? t('common.loading') : t('auth.loginButton')}</Button>
      </form>
      <div className="mt-space-8 text-center">
        <p className="font-body-md text-[14px] text-fg-2">
          {t('auth.noAccount')} <Link to="/register" className="ml-1 font-label text-label text-accent hover:text-accent-hover">{t('auth.registerLink')}</Link>
        </p>
        <Link to="/pazar" className="mt-space-4 inline-block font-label text-label text-fg-2 hover:text-accent">{t('auth.browseMarket')}</Link>
      </div>
    </>
  );
};
export default LoginForm;
