import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/ui';

export const PublicLayout = ({ children }) => {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col bg-surface text-fg">
      <header className="sticky top-0 z-50 flex h-[72px] w-full items-center justify-between border-b border-line bg-surface/95 px-space-6">
        <Link to="/pazar" className="flex items-center gap-space-2">
          <Icon name="recycling" size={32} fill={1} className="text-accent" />
          <span className="font-display-lg text-heading-lg tracking-tight text-accent">{t('brand.name')}</span>
        </Link>
        <div className="flex items-center gap-space-4">
          <Link to="/login" className="hidden px-space-4 py-space-2 font-label text-label text-fg-2 transition-colors hover:text-accent md:block">{t('auth.loginButton')}</Link>
          <Link to="/register" className="flex items-center gap-space-2 rounded-r6 bg-inverse px-space-5 py-[10px] font-label text-label text-on-inverse transition-opacity hover:opacity-90">
            {t('auth.registerLink')}
            <Icon name="arrow_forward" size={16} />
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children ?? <Outlet />}</main>
    </div>
  );
};
export default PublicLayout;
