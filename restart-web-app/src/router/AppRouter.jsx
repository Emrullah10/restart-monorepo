import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from '@layouts/AuthLayout';
import MainLayout from '@layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

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
import NotFoundPage from '@pages/NotFoundPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected App Routes inside Main Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/recycle" element={<RecyclePage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/repair" element={<RepairPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
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
