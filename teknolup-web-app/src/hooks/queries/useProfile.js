import { useQuery } from '@tanstack/react-query';
import { userApi } from '@api/user.api';

export const useProfile = (userId) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userApi.getProfile(userId),
    enabled: !!userId
  });
};

export default useProfile;
