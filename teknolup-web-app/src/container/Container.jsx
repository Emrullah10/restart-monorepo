import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthBootstrap from './AuthBootstrap';
import '@shared/translation/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  }
});

export const Container = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>
        {children}
      </AuthBootstrap>
    </QueryClientProvider>
  );
};

export default Container;
