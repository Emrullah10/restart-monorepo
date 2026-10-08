import axiosInstance from '@shared/axios/axiosInstance';

export const userApi = {
  changePassword: async (currentPassword, newPassword) => {
    const res = await axiosInstance.patch('/user/password', { currentPassword, newPassword });
    return res.data;
  },
  getNotificationPreferences: async () => {
    const res = await axiosInstance.get('/user/notification-preferences');
    return res.data;
  },
  updateNotificationPreferences: async (preferences) => {
    const res = await axiosInstance.put('/user/notification-preferences', preferences);
    return res.data;
  },
  getProfile: async (userId) => {
    const res = await axiosInstance.get(`/user/profile/${userId}`);
    return res.data;
  }
};
