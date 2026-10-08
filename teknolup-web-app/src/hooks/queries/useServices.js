import { useQuery } from '@tanstack/react-query';
import { operationApi } from '@api/operation.api';

export const useServices = (type) => {
  return useQuery({
    queryKey: ['services', type],
    queryFn: () => operationApi.getServices(type)
  });
};

export default useServices;
