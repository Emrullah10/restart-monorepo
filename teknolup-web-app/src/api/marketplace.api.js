import axiosInstance from '@shared/axios/axiosInstance';

export const marketplaceApi = {
  getUserListings: async (userId) => {
    const res = await axiosInstance.get(`/marketplace/listings/${userId}`);
    return res.data;
  },
  getProducts: async ({ category, q, limit } = {}) => {
    const res = await axiosInstance.get('/marketplace/products', { params: { category, q, limit } });
    return res.data;
  },
  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const res = await axiosInstance.post('/marketplace/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  createListing: async (listing) => {
    const res = await axiosInstance.post('/marketplace/listings', listing);
    return res.data;
  }
};
