import { useMutation, useQueryClient } from '@tanstack/react-query';
import { operationApi } from '@api/operation.api';

export const useLogRecycle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => operationApi.logRecycle(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recycleHistory', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['activities', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
    }
  });
};

export default useLogRecycle;
