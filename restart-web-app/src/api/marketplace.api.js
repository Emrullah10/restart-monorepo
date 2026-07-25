import axiosInstance from '@shared/axios/axiosInstance';

export const marketplaceApi = {
  getUserListings: async (userId) => {
    const res = await axiosInstance.get(`/marketplace/listings/${userId}`);
    return res.data;
  },
  getProducts: async (category, limit) => {
    const res = await axiosInstance.get('/marketplace/products', { params: { category, limit } });
    return res.data;
  }
};
