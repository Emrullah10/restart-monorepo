import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/ui';
import { useAuthStore } from '@store/authStore';
import { SUPPORT } from '@shared/config';

export const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  return (
    <div className="min-h-screen bg-surface text-fg">
      <header className="fixed top-0 z-50 w-full border-b border-line bg-raised">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-space-6">
          <Link to="/" className="flex items-center gap-space-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-r4 bg-accent"><Icon name="autorenew" size={20} className="text-[#A8E6C9]" /></div>
            <span className="font-heading-md text-heading-md tracking-tight text-on-accent-subtle">{t('brand.name')}</span>
          </Link>
          <nav className="hidden items-center gap-space-8 md:flex font-caption text-caption text-fg-2">
            <Link to="/" className="transition-colors hover:text-fg">{t('nav.home')}</Link>
            <Link to="/map" className="transition-colors hover:text-fg">{t('nav.map')}</Link>
            <Link to="/pazar" className="transition-colors hover:text-fg">{t('nav.marketplace')}</Link>
          </nav>
          {user ? <div className="flex h-8 w-8 items-center justify-center rounded-r12 bg-accent-strong text-on-accent"><Icon name="person" size={18} /></div> : <Link to="/login" className="font-label text-label text-accent">{t('auth.loginButton')}</Link>}
        </div>
      </header>
      <main className="flex min-h-screen flex-col justify-between pt-16">
        <div className="flex flex-1 items-center justify-center bg-field px-space-6 py-space-12">
          <div className="relative flex w-full max-w-[520px] flex-col items-center rounded-r8 bg-raised p-space-8 text-center shadow-xs sm:p-space-10">
            <div className="mb-space-8 flex w-full items-center justify-between pb-space-6">
              <span className="font-label text-label tracking-wider text-fg-3">{t('notFound.code')}</span>
              <span className="inline-flex items-center gap-space-1 rounded-r2 bg-accent-subtle px-space-2 py-0.5 font-label text-label text-accent"><span className="h-1.5 w-1.5 animate-pulse rounded-r12 bg-accent" />{t('notFound.badge')}</span>
            </div>
            <div className="mb-space-5 flex h-16 w-16 items-center justify-center rounded-r4 bg-muted text-fg-2"><Icon name="explore_off" size={36} weight={300} /></div>
            <div className="mb-space-2 select-none font-data-xl text-data-xl tracking-tight text-fg-3 tabular-nums">404</div>
            <h1 className="mb-space-3 font-heading-lg text-heading-lg tracking-tight text-fg">{t('notFound.title')}</h1>
            <p className="mx-auto mb-space-8 max-w-[40ch] font-body-md text-body-md text-fg-2">{t('notFound.body')}</p>
            <div className="mb-space-8 w-full rounded-r4 bg-field p-space-4 text-left">
              <div className="mb-space-2 flex items-center justify-between"><span className="font-label text-label uppercase text-fg-3">{t('notFound.path')}</span><span className="max-w-[60%] truncate font-label text-label text-fg">{pathname}</span></div>
              <div className="flex items-center justify-between"><span className="font-label text-label uppercase text-fg-3">{t('notFound.status')}</span><span className="font-label text-label text-accent">{t('notFound.online')}</span></div>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-space-3 sm:flex-row">
              <Link to="/" className="flex h-10 w-full items-center justify-center gap-space-2 rounded-r4 bg-accent px-space-6 font-caption text-caption font-semibold text-on-accent transition-colors hover:bg-accent-hover sm:w-auto"><Icon name="home" size={18} />{t('notFound.home')}</Link>
              <Link to="/map" className="flex h-10 w-full items-center justify-center gap-space-2 rounded-r4 bg-strong px-space-5 font-caption text-caption font-medium text-fg transition-colors hover:bg-hover sm:w-auto"><Icon name="travel_explore" size={18} />{t('notFound.map')}</Link>
            </div>
            <div className="mt-space-8 flex w-full items-center justify-center gap-space-6 pt-space-4 font-label text-label uppercase text-fg-3">
              <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-space-1 transition-colors hover:text-fg"><Icon name="arrow_back" size={14} />{t('notFound.back')}</button>
              <span>•</span>
              <a href={`mailto:${SUPPORT.email}`} className="transition-colors hover:text-fg">{t('notFound.report')}</a>
            </div>
          </div>
        </div>
        <footer className="mt-auto w-full border-t border-line bg-subtle py-space-6">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-space-4 px-space-6 font-caption text-caption text-fg-2 sm:flex-row">
            <div>© {new Date().getFullYear()} {t('brand.name')} — {t('notFound.footer')}</div>
            <div className="flex items-center gap-space-6 font-label text-label uppercase"><Link to="/pazar" className="transition-colors hover:text-accent-strong">{t('nav.marketplace')}</Link><Link to="/map" className="transition-colors hover:text-accent-strong">{t('nav.map')}</Link><a href={`mailto:${SUPPORT.email}`} className="transition-colors hover:text-accent-strong">{t('notFound.support')}</a></div>
          </div>
        </footer>
      </main>
    </div>
  );
};
export default NotFoundPage;
