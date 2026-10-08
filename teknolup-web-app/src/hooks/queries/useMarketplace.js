import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '@api/marketplace.api';

export const useProducts = ({ category, q, limit } = {}) => {
  return useQuery({
    queryKey: ['products', category, q, limit],
    queryFn: () => marketplaceApi.getProducts({ category, q, limit })
  });
};

export const useUserListings = (userId) => {
  return useQuery({
    queryKey: ['userListings', userId],
    queryFn: () => marketplaceApi.getUserListings(userId),
    enabled: !!userId
  });
};

export const useUploadImages = () => {
  return useMutation({
    mutationFn: (files) => marketplaceApi.uploadImages(files)
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listing) => marketplaceApi.createListing(listing),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userListings', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};
