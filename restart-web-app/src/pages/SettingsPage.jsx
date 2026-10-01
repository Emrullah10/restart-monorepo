import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon, cx } from '@components/ui';
import { useThemeStore } from '@store/themeStore';
import { useAuthStore } from '@store/authStore';
import { authApi } from '@api/auth.api';
import { LEGAL } from '@shared/config';

const sec = 'border-b border-line pb-2 font-label text-label uppercase tracking-wider text-fg-2';
const box = 'flex flex-col rounded-r4 border border-line bg-raised';
const row = 'flex items-center justify-between p-space-5 transition-colors hover:bg-hover';

export const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { preference, setPreference } = useThemeStore();
  const logout = useAuthStore((s) => s.logout);
  const doLogout = async () => { try { await authApi.logout(); } catch { /* session already gone */ } logout(); navigate('/login'); };

  return (
    <main className="flex justify-center bg-canvas px-space-6 py-space-10 md:py-space-12">
      <div className="flex w-full max-w-[640px] flex-col gap-space-10">
        <div className="mb-space-4 flex flex-col gap-space-2">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-fg md:font-display-lg md:text-display-lg">{t('settings.title')}</h1>
          <p className="font-body-md text-body-md text-fg-2">{t('settings.subtitle')}</p>
        </div>

        <section className="flex flex-col gap-space-4">
          <h3 className={sec}>{t('settings.appearance')}</h3>
          <div className={cx(box, 'gap-space-6 p-space-6')}>
            <div className="flex flex-col justify-between gap-space-4 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-1"><span className="font-heading-md text-base text-fg">{t('settings.theme')}</span><span className="font-caption text-caption text-fg-2">{t('settings.themeHint')}</span></div>
              <div role="radiogroup" className="flex rounded-r4 border border-line bg-strong p-1">
                {['light', 'dark', 'system'].map((m) => (
                  <button key={m} type="button" role="radio" aria-checked={preference === m} onClick={() => setPreference(m)} className={cx('flex items-center justify-center rounded-r2 px-4 py-2 font-label text-label', preference === m ? 'border border-line bg-raised text-fg shadow-xs' : 'text-fg-2 hover:text-fg')}>{t(`settings.themes.${m}`)}</button>
                ))}
              </div>
            </div>
            <div className="h-px w-full bg-line" />
            <div className="flex flex-col justify-between gap-space-4 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-1"><span className="font-heading-md text-base text-fg">{t('shell.language')}</span><span className="font-caption text-caption text-fg-2">{t('settings.languageHint')}</span></div>
              <div className="relative w-full sm:w-48">
                <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)} className="w-full appearance-none rounded-r4 border border-line bg-field py-2 pl-3 pr-10 font-body-md text-body-md text-fg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"><option value="tr">Türkçe</option><option value="en">English</option></select>
                <Icon name="expand_more" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg-2" />
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-space-4">
          <h3 className={sec}>{t('settings.account')}</h3>
          <div className={box}>
            {[['person', 'settings.profileInfo', '/profile'], ['key', 'settings.passwordAuth', null], ['notifications_active', 'settings.notifPrefs', '/notifications']].map(([ic, k, to], i, a) => {
              const inner = <><div className="flex items-center gap-space-4"><Icon name={ic} className="text-fg-2" /><span className="font-heading-md text-base text-fg">{t(k)}</span></div><Icon name="chevron_right" className="text-fg-2" /></>;
              const cls = cx(row, i < a.length - 1 && 'border-b border-line');
              return to ? <Link key={k} to={to} className={cls}>{inner}</Link> : <button key={k} type="button" onClick={() => window.alert(t('common.comingSoon'))} className={cx(cls, 'w-full text-left')}>{inner}</button>;
            })}
          </div>
        </section>

        <section className="flex flex-col gap-space-4">
          <h3 className={sec}>{t('settings.security')}</h3>
          <div className={cx(box, 'flex-row items-center justify-between p-space-5')}>
            <div className="flex items-center gap-space-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-r12 bg-accent-container text-accent-strong"><Icon name="verified_user" /></div>
              <div className="flex flex-col"><span className="font-heading-md text-base text-fg">{t('settings.session')}</span><span className="font-caption text-caption text-fg-2">{t('settings.lastActive')}</span></div>
            </div>
            <span className="rounded-r2 border border-accent-container-dim bg-accent-container/30 px-3 py-1 font-label text-label text-accent-strong">{t('settings.secure')}</span>
          </div>
        </section>

        <section className="flex flex-col gap-space-4">
          <h3 className={sec}>{t('settings.about')}</h3>
          <div className={box}>
            <a href={LEGAL.terms} className={cx(row, 'border-b border-line')}><span className="font-body-md text-body-md text-fg">{t('settings.terms')}</span><Icon name="open_in_new" size={14} className="text-fg-2" /></a>
            <a href={LEGAL.privacy} className={cx(row, 'border-b border-line')}><span className="font-body-md text-body-md text-fg">{t('settings.privacy')}</span><Icon name="open_in_new" size={14} className="text-fg-2" /></a>
            <div className="flex items-center justify-between bg-raised p-space-5"><span className="font-body-md text-body-md text-fg-2">{t('settings.version')}</span><span className="font-label text-label text-fg-2">{__APP_VERSION__}</span></div>
          </div>
        </section>

        <div className="mt-space-2 flex justify-end border-t border-line pt-space-6">
          <button type="button" onClick={doLogout} className="flex w-full items-center justify-center gap-2 rounded-r4 border border-danger bg-danger px-space-6 py-3 font-label text-label text-white transition-opacity hover:opacity-90 dark:border-danger/30 dark:bg-danger/20 dark:text-danger sm:w-auto"><Icon name="logout" />{t('nav.logout')}</button>
        </div>
      </div>
    </main>
  );
};
export default SettingsPage;
