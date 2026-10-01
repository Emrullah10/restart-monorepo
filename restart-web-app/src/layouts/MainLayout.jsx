import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon, Avatar, cx } from '@components/ui';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';
import { useProfile } from '@hooks/queries/useProfile';
import { computeLevel } from '@shared/level';
import { shortName } from '@shared/format';

// Sidebar order (web) and bottom-nav order (mobile web, same as the Flutter app).
const SIDE_NAV = [
  { to: '/', icon: 'home', label: 'nav.home', end: true },
  { to: '/map', icon: 'map', label: 'nav.map' },
  { to: '/recycle', icon: 'recycling', label: 'nav.recycle' },
  { to: '/sell', icon: 'sell', label: 'nav.sell', also: ['/create-listing'] },
  { to: '/rewards', icon: 'workspace_premium', label: 'nav.rewards' },
  { to: '/repair', icon: 'build', label: 'nav.repair' },
];
const BOTTOM_NAV = [
  { to: '/map', icon: 'map', label: 'nav.map' },
  { to: '/recycle', icon: 'recycling', label: 'nav.recycleShort' },
  { to: '/', icon: 'home', label: 'nav.home', end: true },
  { to: '/sell', icon: 'sell', label: 'nav.sell', also: ['/create-listing'] },
  { to: '/rewards', icon: 'workspace_premium', label: 'nav.rewards' },
];

const useActive = (item) => {
  const { pathname } = useLocation();
  if (item.end) return pathname === item.to;
  return [item.to, ...(item.also ?? [])].some((p) => pathname === p || pathname.startsWith(`${p}/`));
};

function SideItem({ item }) {
  const { t } = useTranslation();
  const active = useActive(item);
  return (
    <NavLink
      to={item.to}
      className={cx(
        'flex items-center gap-space-3 border-l-[3px] px-space-4 py-space-3 font-label text-label transition-colors',
        active ? 'border-accent bg-muted font-bold text-accent' : 'border-transparent text-fg-2 hover:bg-hover',
      )}
    >
      <Icon name={item.icon} fill={active ? 1 : 0} weight={active ? 700 : 400} />
      <span>{t(item.label)}</span>
    </NavLink>
  );
}

function Sidebar({ user, levelText }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const onProfile = pathname.startsWith('/profile');
  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] flex-col border-r border-line bg-surface md:flex">
      <div className="flex flex-col gap-space-1 border-b border-line px-6 py-8">
        <h1 className="font-display-lg text-heading-lg tracking-tight text-accent">{t('brand.name')}</h1>
        <span className="font-label text-label uppercase text-fg-2">{t('brand.tagline')}</span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto py-4">
        {SIDE_NAV.map((item) => <SideItem key={item.to} item={item} />)}
      </div>
      <Link
        to="/profile"
        className={cx('flex items-center gap-space-3 border-l-[3px] border-t border-t-line p-6 transition-colors', onProfile ? 'border-l-accent bg-muted' : 'border-l-transparent hover:bg-hover')}
      >
        <Avatar name={user?.fullName} src={user?.avatarUrl} size={32} />
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-label text-label text-fg">{shortName(user?.fullName) || t('shell.user')}</span>
          <span className="truncate font-caption text-caption text-fg-2">{levelText}</span>
        </div>
      </Link>
    </nav>
  );
}

function TopBar({ title }) {
  const { t, i18n } = useTranslation();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const btn = 'p-1 text-fg-2 transition-colors hover:text-accent';
  return (
    <header className="sticky top-0 z-30 hidden h-[73px] items-center justify-between border-b border-line bg-surface px-6 md:flex">
      <div>{title && <h2 className="font-heading-md text-heading-md text-fg">{title}</h2>}</div>
      <div className="flex items-center gap-space-4">
        <Link to="/notifications" aria-label={t('nav.notifications')} className={btn}><Icon name="notifications" /></Link>
        <Link to="/settings" aria-label={t('nav.settings')} className={btn}><Icon name="settings" /></Link>
        <button type="button" aria-label={t('shell.language')} className={btn} onClick={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}><Icon name="language" /></button>
        <button type="button" aria-label={t('shell.theme')} className={btn} onClick={toggleTheme}><Icon name="contrast" /></button>
      </div>
    </header>
  );
}

function MobileTopBar({ user }) {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface px-6 py-4 md:hidden">
      <h1 className="font-heading-lg text-heading-lg text-accent">{t('brand.name')}</h1>
      <Link to="/profile" aria-label={t('nav.profile')}><Avatar name={user?.fullName} src={user?.avatarUrl} size={32} /></Link>
    </header>
  );
}

function BottomItem({ item }) {
  const { t } = useTranslation();
  const active = useActive(item);
  return (
    <li className="flex-1">
      <NavLink to={item.to} className={cx('flex h-full w-full flex-col items-center justify-center gap-1 transition-colors', active ? 'text-accent' : 'text-fg-2 hover:text-accent')}>
        <div className={cx('flex items-center justify-center rounded-r12 px-4 py-1', active && 'bg-muted')}>
          <Icon name={item.icon} fill={active ? 1 : 0} />
        </div>
        <span className={cx('font-label text-[10px] tracking-normal', active && 'font-bold')}>{t(item.label)}</span>
      </NavLink>
    </li>
  );
}

function MobileBottomNav() {
  return (
    <nav className="pb-safe fixed bottom-0 left-0 z-40 w-full border-t border-line bg-surface px-2 pt-2 md:hidden">
      <ul className="flex h-16 items-center justify-between">
        {BOTTOM_NAV.map((item) => <BottomItem key={item.to} item={item} />)}
      </ul>
    </nav>
  );
}

/** Authenticated app shell. Pages render via <Outlet/> (or children for the "/" route). */
export const MainLayout = ({ children, title }) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile(user?.id);
  const { level } = computeLevel(profile?.stats?.totalPoints);
  return (
    <div className="min-h-screen bg-canvas text-fg">
      <Sidebar user={user} levelText={t('shell.levelShort', { level })} />
      <main className="flex min-h-screen flex-col md:ml-[240px]">
        <TopBar title={title} />
        <MobileTopBar user={user} />
        <div className="flex-1 pb-[100px] md:pb-0">{children ?? <Outlet />}</div>
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;
