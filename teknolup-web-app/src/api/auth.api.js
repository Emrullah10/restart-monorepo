import axiosInstance from '@shared/axios/axiosInstance';

export const authApi = {
  login: async (email, password) => {
    const res = await axiosInstance.post('/gateway/login', { email, password });
    return res.data;
  },
  register: async (email, password, fullName) => {
    const res = await axiosInstance.post('/gateway/register', { email, password, fullName });
    return res.data;
  },
  getCurrentUser: async () => {
    try {
      const res = await axiosInstance.get('/gateway/me');
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) return null;
      throw err;
    }
  },
  logout: async () => {
    const res = await axiosInstance.post('/gateway/logout');
    return res.data;
  }
};
