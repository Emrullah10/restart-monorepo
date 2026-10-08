import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@api/notifications.api';

export const useNotifications = (userId) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationsApi.getNotifications(userId),
    enabled: !!userId
  });
};

export const useMarkNotificationRead = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId) => notificationsApi.markRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    }
  });
};

export const useMarkAllNotificationsRead = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    }
  });
};
