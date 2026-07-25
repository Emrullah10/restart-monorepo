import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Preserves HttpOnly session cookies from restart-web-gateway
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 Unauthenticated - state handled cleanly by AuthBootstrap/useAuthStore
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
