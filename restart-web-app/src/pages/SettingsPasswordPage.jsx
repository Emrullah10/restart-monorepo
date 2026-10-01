import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon, TextField, PasswordStrength } from '@components/ui';
import { userApi } from '@api/user.api';

export const SettingsPasswordPage = () => {
  const { t } = useTranslation();
  const [f, setF] = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError(''); setDone(false);
    if (!f.current || !f.next || !f.confirm) return setError(t('auth.fillAll'));
    if (f.next.length < 8) return setError(t('settings.passwordTooShort'));
    if (f.next !== f.confirm) return setError(t('auth.mismatch'));
    try {
      setBusy(true);
      await userApi.changePassword(f.current, f.next);
      setDone(true); setF({ current: '', next: '', confirm: '' });
    } catch (err) {
      setError(err.response?.status === 401 ? t('settings.passwordWrong') : (err.response?.data?.error || t('common.error')));
    } finally { setBusy(false); }
  };
  const field = { radius: 'r4', height: 'h-12', ring: 'border', upperLabel: true };

  return (
    <main className="flex justify-center px-space-6 py-space-10">
      <div className="flex w-full max-w-[480px] flex-col gap-space-8">
        <Link to="/settings" className="flex items-center gap-space-2 font-label text-label text-fg-2 hover:text-accent"><Icon name="arrow_back" size={18} />{t('nav.settings')}</Link>
        <div className="flex flex-col gap-space-2">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-fg">{t('settings.passwordAuth')}</h1>
          <p className="font-body-md text-body-md text-fg-2">{t('settings.passwordHint')}</p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-space-6" noValidate>
          <TextField {...field} label={t('settings.currentPassword')} icon="lock" password autoComplete="current-password" value={f.current} onChange={set('current')} />
          <div>
            <TextField {...field} label={t('settings.newPassword')} icon="key" password autoComplete="new-password" value={f.next} onChange={set('next')} />
            <PasswordStrength value={f.next} showHint />
          </div>
          <TextField {...field} label={t('auth.passwordConfirm')} icon="lock_reset" password autoComplete="new-password" value={f.confirm} onChange={set('confirm')} />
          {error && <p role="alert" className="font-caption text-caption text-danger">{error}</p>}
          {done && <p role="status" className="flex items-center gap-space-2 font-caption text-caption text-accent"><Icon name="check_circle" size={16} fill={1} />{t('settings.passwordChanged')}</p>}
          <button type="submit" disabled={busy} className="flex h-12 w-full items-center justify-center rounded-r4 bg-accent font-label text-label uppercase text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50">{busy ? t('common.loading') : t('settings.passwordSave')}</button>
        </form>
      </div>
    </main>
  );
};
export default SettingsPasswordPage;
