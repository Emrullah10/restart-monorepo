import { useQuery } from '@tanstack/react-query';
import { operationApi } from '@api/operation.api';

export const useActivities = (userId, limit = 10) => {
  return useQuery({
    queryKey: ['activities', userId, limit],
    queryFn: () => operationApi.getActivities(userId, limit),
    enabled: !!userId
  });
};

export default useActivities;
