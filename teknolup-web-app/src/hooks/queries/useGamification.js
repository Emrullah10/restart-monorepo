import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '@api/gamification.api';

export const useLeaderboard = (userId, limit = 5) => {
  return useQuery({
    queryKey: ['leaderboard', userId, limit],
    queryFn: () => gamificationApi.getLeaderboard(userId, limit),
    enabled: !!userId
  });
};

export const useBadges = (userId) => {
  return useQuery({
    queryKey: ['badges', userId],
    queryFn: () => gamificationApi.getUserBadges(userId),
    enabled: !!userId
  });
};

export const useRewards = () => {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: () => gamificationApi.getRewards()
  });
};

export const useRedeemReward = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rewardId) => gamificationApi.redeemReward(userId, rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    }
  });
};
