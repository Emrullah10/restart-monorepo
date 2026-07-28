import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  MapPin,
  Recycle,
  Tag,
  Award,
  Wrench,
  User,
  Bell,
  Settings,
  LogOut,
  Plus
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { authApi } from '@api/auth.api';
import { useNotifications } from '@hooks/queries/useNotifications';
import ThemeToggle from '@components/ThemeToggle/ThemeToggle';
import LanguageToggle from '@components/LanguageToggle/LanguageToggle';
import { useTranslation } from 'react-i18next';
import styles from './MainLayout.module.scss';

export const MainLayout = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: notifications } = useNotifications(user?.id);
  const hasUnreadNotifications = (notifications ?? []).some((n) => !n.isRead);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (_) {}
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: t('navHome'), icon: Home },
    { path: '/map', label: t('navMap'), icon: MapPin },
    { path: '/recycle', label: t('navRecycle'), icon: Recycle },
    { path: '/sell', label: t('navSell'), icon: Tag },
    { path: '/rewards', label: t('navRewards'), icon: Award },
    { path: '/repair', label: t('navRepair'), icon: Wrench }
  ];

  return (
    <div className={styles.layoutContainer}>
      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoBadge}>
            <Recycle size={24} />
          </div>
          <span className={styles.logoText}>ReStart</span>
        </div>

        <nav className={styles.navMenu}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${styles.profileLink} ${isActive ? styles.activeProfile : ''}`
            }
          >
            <div className={styles.avatar}>
              <img
                src={
                  user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
                }
                alt="Profile"
              />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.fullName || 'Kullanıcı'}</span>
              <span className={styles.userRole}>Eco Member</span>
            </div>
          </NavLink>

          <button onClick={handleLogout} className={styles.logoutBtn} title={t('navLogout')}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerTitleArea}>
            <span className={styles.greeting}>Merhaba, {user?.fullName || 'Hoş geldiniz'} 👋</span>
          </div>

          <div className={styles.headerActions}>
            <button
              onClick={() => navigate('/create-listing')}
              className={styles.createListingBtn}
            >
              <Plus size={18} />
              <span>İlan Ver</span>
            </button>

            <button
              onClick={() => navigate('/notifications')}
              className={styles.iconBtn}
              title={t('navNotifications')}
            >
              <Bell size={20} />
              {hasUnreadNotifications && <span className={styles.notificationDot} />}
            </button>

            <button
              onClick={() => navigate('/settings')}
              className={styles.iconBtn}
              title={t('navSettings')}
            >
              <Settings size={20} />
            </button>

            <ThemeToggle />
            <LanguageToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent} key={location.pathname}>
          {children ?? <Outlet />}
        </main>

        {/* Mobile Floating Action Button (Only on Home Route) */}
        {location.pathname === '/' && (
          <button
            onClick={() => navigate('/create-listing')}
            className={styles.mobileFab}
            aria-label="Create Listing"
          >
            <Plus size={26} />
          </button>
        )}

        {/* Mobile Glassmorphism Bottom Navigation */}
        <nav className={styles.bottomNav}>
          <div className={styles.bottomNavGlass}>
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`${styles.bottomNavItem} ${isActive ? styles.bottomNavActive : ''}`}
                >
                  <div className={styles.bottomIconWrapper}>
                    <Icon size={22} />
                  </div>
                  {isActive && <span className={styles.bottomLabel}>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MainLayout;
