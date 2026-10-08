import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextField, PasswordStrength, Icon } from '@components/ui';
import { authApi } from '@api/auth.api';
import { useAuthStore } from '@store/authStore';

export const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirm) { setErrorMsg(t('auth.fillAll')); return; }
    if (form.password !== form.confirm) { setErrorMsg(t('auth.mismatch')); return; }
    if (!terms) { setErrorMsg(t('auth.termsRequired')); return; }
    try {
      setLoading(true); setErrorMsg('');
      const data = await authApi.register(form.email, form.password, form.fullName);
      setUser(data.user || data);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || t('auth.registerFailed'));
    } finally { setLoading(false); }
  };

  const field = { upperLabel: true, labelClass: 'text-fg-2', radius: 'r4', height: 'h-12', ring: 'border' };
  return (
    <>
      <header className="mb-space-10">
        <h2 className="mb-space-3 font-display-lg text-display-lg-mobile text-fg lg:text-display-lg">{t('auth.registerTitle')}</h2>
        <p className="font-body-md text-body-md text-fg-2">
          {t('auth.registerSubtitle')}{' '}
          <Link to="/login" className="font-semibold text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent-hover">{t('auth.loginButton')}</Link>
        </p>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-6" noValidate>
        <TextField {...field} label={t('auth.fullName')} icon="person" placeholder={t('auth.fullNamePlaceholder')} value={form.fullName} onChange={set('fullName')} />
        <TextField {...field} label={t('auth.emailAddress')} icon="mail" type="email" autoComplete="email" placeholder={t('auth.emailPlaceholder')} value={form.email} onChange={set('email')} />
        <div>
          <TextField {...field} label={t('auth.password')} icon="lock" password autoComplete="new-password" placeholder="••••••••" value={form.password} onChange={set('password')} />
          <PasswordStrength value={form.password} showHint />
        </div>
        <TextField {...field} label={t('auth.passwordConfirm')} icon="lock_reset" password autoComplete="new-password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} />
        <div className="mt-space-2 flex items-start gap-space-3">
          <input id="terms" type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 h-4 w-4 cursor-pointer rounded-r2 border-line bg-field-canvas accent-[var(--c-accent)]" />
          <label htmlFor="terms" className="cursor-pointer select-none font-caption text-caption text-fg-3">
            <Link to="/terms" className="text-accent hover:underline">{t('auth.terms')}</Link>{t('auth.termsMid')}<Link to="/privacy" className="text-accent hover:underline">{t('auth.privacy')}</Link>{t('auth.termsEnd')}
          </label>
        </div>
        {errorMsg && <p role="alert" className="font-caption text-caption text-danger">{errorMsg}</p>}
        <button type="submit" disabled={loading} className="group mt-space-6 flex h-12 w-full items-center justify-center gap-space-2 rounded-r4 bg-accent font-label text-label uppercase text-on-accent transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50">
          <span>{loading ? t('common.loading') : t('auth.registerButton')}</span>
          <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </>
  );
};
export default RegisterForm;
