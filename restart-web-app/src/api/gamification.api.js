import axiosInstance from '@shared/axios/axiosInstance';

export const gamificationApi = {
  getLeaderboard: async (userId, limit = 5) => {
    const res = await axiosInstance.get('/gamification/leaderboard', { params: { userId, limit } });
    return res.data;
  },
  getUserBadges: async (userId) => {
    const res = await axiosInstance.get(`/gamification/badges/${userId}`);
    return res.data;
  },
  getRewards: async () => {
    const res = await axiosInstance.get('/rewards');
    return res.data;
  }
};
