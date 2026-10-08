import { makeDatasource } from '@teknolup/datasource';
import { makeDatasourceConfig } from '@teknolup/config';
import { wrapWithHttpTranslation } from '@teknolup/errors';
import { makeUserRepository } from '@teknolup/core-iam/src/infrastructure/persistence/repositories/user.repository.js';
import { makeRegisterUser } from '@teknolup/core-iam/src/application/use-cases/register-user.use-case.js';
import { makeLoginUser } from '@teknolup/core-iam/src/application/use-cases/login-user.use-case.js';
import { makeGetUserProfile } from '@teknolup/core-iam/src/application/use-cases/get-user-profile.use-case.js';
import { makeGetLeaderboard } from '@teknolup/core-iam/src/application/use-cases/get-leaderboard.use-case.js';
import { makeGetUserBadges } from '@teknolup/core-iam/src/application/use-cases/get-user-badges.use-case.js';
import { makeGetRewards } from '@teknolup/core-iam/src/application/use-cases/get-rewards.use-case.js';
import { makeRedeemReward } from '@teknolup/core-iam/src/application/use-cases/redeem-reward.use-case.js';
import { makeSubmitContactMessage } from '@teknolup/core-iam/src/application/use-cases/submit-contact-message.use-case.js';
import { makeGetNotifications } from '@teknolup/core-iam/src/application/use-cases/get-notifications.use-case.js';
import { makeMarkNotificationRead, makeMarkAllNotificationsRead } from '@teknolup/core-iam/src/application/use-cases/mark-notifications-read.use-case.js';
import { makeChangePassword } from '@teknolup/core-iam/src/application/use-cases/change-password.use-case.js';
import { makeGetNotificationPreferences, makeUpdateNotificationPreferences } from '@teknolup/core-iam/src/application/use-cases/notification-preferences.use-case.js';
import { makeUsersController } from '@teknolup/core-iam/src/interfaces/http/users.controller.js';
import { makeGamificationController } from '@teknolup/core-iam/src/interfaces/http/gamification.controller.js';
import { makeMiscController } from '@teknolup/core-iam/src/interfaces/http/misc.controller.js';
import { makeNotificationsController } from '@teknolup/core-iam/src/interfaces/http/notifications.controller.js';
import { createAuthRoutes, createUserRoutes, createGamificationRoutes, createMiscRoutes, createNotificationsRoutes } from '@teknolup/core-iam/src/interfaces/http/routes.js';
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

  const changePassword = makeChangePassword({ userRepo });
  const getNotificationPreferences = makeGetNotificationPreferences({ userRepo });
  const updateNotificationPreferences = makeUpdateNotificationPreferences({ userRepo });

  const usersController = makeUsersController({ registerUser, loginUser, getUserProfile, changePassword, getNotificationPreferences, updateNotificationPreferences });
  const wrappedController = {
    register: wrap(usersController.register),
    login: wrap(usersController.login),
    getProfile: wrap(usersController.getProfile),
    changePassword: wrap(usersController.changePassword),
    getNotificationPreferences: wrap(usersController.getNotificationPreferences),
    updateNotificationPreferences: wrap(usersController.updateNotificationPreferences),
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
