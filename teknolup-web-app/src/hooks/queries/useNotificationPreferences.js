import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@api/user.api';

const KEY = ['notificationPreferences'];

export const useNotificationPreferences = () => useQuery({ queryKey: KEY, queryFn: userApi.getNotificationPreferences });

export const useUpdateNotificationPreferences = (userId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch) => userApi.updateNotificationPreferences(patch),
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData(KEY);
      qc.setQueryData(KEY, { ...prev, ...patch });
      return { prev };
    },
    onError: (_e, _p, ctx) => qc.setQueryData(KEY, ctx.prev),
    onSettled: () => { qc.invalidateQueries({ queryKey: KEY }); qc.invalidateQueries({ queryKey: ['notifications', userId] }); },
  });
};
