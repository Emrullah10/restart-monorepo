import { makeDatasource } from '@restart/datasource';
import { makeDatasourceConfig } from '@restart/config';
import { wrapWithHttpTranslation } from '@restart/errors';
import { makeUserRepository } from '@restart/core-iam/src/infrastructure/persistence/repositories/user.repository.js';
import { makeRegisterUser } from '@restart/core-iam/src/application/use-cases/register-user.use-case.js';
import { makeLoginUser } from '@restart/core-iam/src/application/use-cases/login-user.use-case.js';
import { makeGetUserProfile } from '@restart/core-iam/src/application/use-cases/get-user-profile.use-case.js';
import { makeGetLeaderboard } from '@restart/core-iam/src/application/use-cases/get-leaderboard.use-case.js';
import { makeGetUserBadges } from '@restart/core-iam/src/application/use-cases/get-user-badges.use-case.js';
import { makeGetRewards } from '@restart/core-iam/src/application/use-cases/get-rewards.use-case.js';
import { makeRedeemReward } from '@restart/core-iam/src/application/use-cases/redeem-reward.use-case.js';
import { makeSubmitContactMessage } from '@restart/core-iam/src/application/use-cases/submit-contact-message.use-case.js';
import { makeGetNotifications } from '@restart/core-iam/src/application/use-cases/get-notifications.use-case.js';
import { makeMarkNotificationRead, makeMarkAllNotificationsRead } from '@restart/core-iam/src/application/use-cases/mark-notifications-read.use-case.js';
import { makeUsersController } from '@restart/core-iam/src/interfaces/http/users.controller.js';
import { makeGamificationController } from '@restart/core-iam/src/interfaces/http/gamification.controller.js';
import { makeMiscController } from '@restart/core-iam/src/interfaces/http/misc.controller.js';
import { makeNotificationsController } from '@restart/core-iam/src/interfaces/http/notifications.controller.js';
import { createAuthRoutes, createUserRoutes, createGamificationRoutes, createMiscRoutes, createNotificationsRoutes } from '@restart/core-iam/src/interfaces/http/routes.js';
import { jwtSecret } from '../configs/app-config.js';

export const buildContainer = ({ datasourceConfig = makeDatasourceConfig(), translateHttpErrors = true } = {}) => {
  const { query } = makeDatasource(datasourceConfig);
  const wrap = translateHttpErrors ? wrapWithHttpTranslation : (fn) => fn;

  const userRepo = makeUserRepository({ query });

  const registerUser = makeRegisterUser({ userRepo, jwtSecret });
  const loginUser = makeLoginUser({ userRepo, jwtSecret });
  const getUserProfile = makeGetUserProfile({ userRepo });
  const getLeaderboard = makeGetLeaderboard({ userRepo });
  const getUserBadges = makeGetUserBadges({ userRepo });
  const getRewards = makeGetRewards({ userRepo });
  const redeemReward = makeRedeemReward({ userRepo });
  const submitContactMessage = makeSubmitContactMessage();
  const getNotifications = makeGetNotifications({ userRepo });
  const markNotificationRead = makeMarkNotificationRead({ userRepo });
  const markAllNotificationsRead = makeMarkAllNotificationsRead({ userRepo });

  const usersController = makeUsersController({ registerUser, loginUser, getUserProfile });
  const wrappedController = {
    register: wrap(usersController.register),
    login: wrap(usersController.login),
    getProfile: wrap(usersController.getProfile),
  };

  const gamificationController = makeGamificationController({ getLeaderboard, getUserBadges });
  const wrappedGamificationController = {
    getLeaderboard: wrap(gamificationController.getLeaderboard),
    getUserBadges: wrap(gamificationController.getUserBadges),
  };

  const miscController = makeMiscController({ getRewards, submitContactMessage, redeemReward });
  const wrappedMiscController = {
    getRewards: wrap(miscController.getRewards),
    redeemReward: wrap(miscController.redeemReward),
    submitContactMessage: wrap(miscController.submitContactMessage),
  };

  const notificationsController = makeNotificationsController({
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  });
  const wrappedNotificationsController = {
    getNotifications: wrap(notificationsController.getNotifications),
    markRead: wrap(notificationsController.markRead),
    markAllRead: wrap(notificationsController.markAllRead),
  };

  return {
    authRoutes: createAuthRoutes({ usersController: wrappedController }),
    userRoutes: createUserRoutes({ usersController: wrappedController }),
    gamificationRoutes: createGamificationRoutes({ gamificationController: wrappedGamificationController }),
    miscRoutes: createMiscRoutes({ miscController: wrappedMiscController }),
    notificationsRoutes: createNotificationsRoutes({ notificationsController: wrappedNotificationsController }),
  };
};
