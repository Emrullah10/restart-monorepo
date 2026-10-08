import axiosInstance from '@shared/axios/axiosInstance';

export const operationApi = {
  logRecycle: async (data) => {
    const res = await axiosInstance.post('/operation/recycle/log', data);
    return res.data;
  },
  getRecycleHistory: async (userId) => {
    const res = await axiosInstance.get(`/operation/recycle/history/${userId}`);
    return res.data;
  },
  getActivities: async (userId, limit = 10) => {
    const res = await axiosInstance.get(`/operation/activities/${userId}`, { params: { limit } });
    return res.data;
  },
  getServices: async (type) => {
    const res = await axiosInstance.get('/operation/services', { params: { type } });
    return res.data;
  },
  generateMotivation: async (productModel, condition) => {
    const res = await axiosInstance.post('/operation/ai/generate-motivation', { productModel, condition });
    return res.data;
  },
  findCouriers: async (lat, lng) => {
    const res = await axiosInstance.post('/operation/logistics/find', { lat, lng });
    return res.data;
  }
};
