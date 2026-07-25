import React, { useEffect } from 'react';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';
import { authApi } from '@api/auth.api';

export const AuthBootstrap = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
    
    // Hydration-then-verify
    const verifySession = async () => {
      try {
        const user = await authApi.getCurrentUser();
        setUser(user);
      } catch (err) {
        setUser(null);
      }
    };

    verifySession();
  }, [setUser, initTheme]);

  return children;
};

export default AuthBootstrap;
