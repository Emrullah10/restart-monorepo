import axiosInstance from '@shared/axios/axiosInstance';

export const userApi = {
  getProfile: async (userId) => {
    const res = await axiosInstance.get(`/user/profile/${userId}`);
    return res.data;
  }
};
