import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

export const ProtectedRoute = () => {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#111827' }}>
        <span style={{ color: '#10B981', fontWeight: '700' }}>ReStart Yükleniyor...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
