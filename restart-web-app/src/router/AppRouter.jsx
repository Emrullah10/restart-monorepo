import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '@layouts/AuthLayout';
import MainLayout from '@layouts/MainLayout';
import PublicLayout from '@layouts/PublicLayout';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '@store/authStore';

import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import RecyclePage from '@pages/RecyclePage';
import SellPage from '@pages/SellPage';
import RepairPage from '@pages/RepairPage';
import RewardsPage from '@pages/RewardsPage';
import MapPage from '@pages/MapPage';
import ProfilePage from '@pages/ProfilePage';
import NotificationsPage from '@pages/NotificationsPage';
import SettingsPage from '@pages/SettingsPage';
import CreateListingPage from '@pages/CreateListingPage';
import PublicMarketplacePage from '@pages/PublicMarketplacePage';
import NotFoundPage from '@pages/NotFoundPage';
import SettingsPasswordPage from '@pages/SettingsPasswordPage';
import NotificationPreferencesPage from '@pages/NotificationPreferencesPage';
import LegalPage from '@pages/LegalPage';

const PublicMarketplaceRoute = () => {
  const user = useAuthStore((state) => state.user);
  if (user) return <Navigate to="/sell" replace />;
  return <PublicMarketplacePage />;
};

// Root '/' is the landing page: signed-out visitors see the marketplace
// showcase (public layout), signed-in users see their HomePage (main layout).
const RootRoute = () => {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <span className="font-label text-label uppercase tracking-widest text-accent">ReStart</span>
      </div>
    );
  }

  if (!user) {
    return (
      <PublicLayout>
        <PublicMarketplacePage />
      </PublicLayout>
    );
  }

  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  );
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRoute />} />

        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Legal pages (public) */}
        <Route element={<PublicLayout />}>
          <Route path="/terms" element={<LegalPage kind="terms" />} />
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
        </Route>

        {/* Public Marketplace Showcase (no login required) */}
        <Route element={<PublicLayout />}>
          <Route path="/pazar" element={<PublicMarketplaceRoute />} />
        </Route>

        {/* Protected App Routes inside Main Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/map" element={<MapPage />} />
            <Route path="/recycle" element={<RecyclePage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/repair" element={<RepairPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/password" element={<SettingsPasswordPage />} />
            <Route path="/settings/notifications" element={<NotificationPreferencesPage />} />
            <Route path="/create-listing" element={<CreateListingPage />} />
          </Route>
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
