import { deriveBadgesFromStats } from '../../domain/entities/badge.entity.js';

export const makeGetUserBadges = ({ userRepo }) => async ({ userId }) => {
  const stats = await userRepo.getUserStats(userId);
  return deriveBadgesFromStats(stats);
};
