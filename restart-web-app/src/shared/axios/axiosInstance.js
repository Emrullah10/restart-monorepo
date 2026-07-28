import axios from 'axios';
import { useAuthStore } from '@store/authStore';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Preserves HttpOnly session cookies from restart-web-gateway
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired/invalid - clear store so ProtectedRoute redirects to /login
      const { user, logout } = useAuthStore.getState();
      if (user) logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
