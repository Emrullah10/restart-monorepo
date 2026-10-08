import axiosInstance from '@shared/axios/axiosInstance';

export const notificationsApi = {
  getNotifications: async (userId) => {
    const res = await axiosInstance.get(`/notifications/${userId}`);
    return res.data;
  },
  markRead: async (notificationId) => {
    const res = await axiosInstance.patch(`/notifications/${notificationId}/read`);
    return res.data;
  },
  markAllRead: async (userId) => {
    const res = await axiosInstance.patch(`/notifications/${userId}/read-all`);
    return res.data;
  }
};
