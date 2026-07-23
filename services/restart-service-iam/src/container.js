import { makeDatasource } from '@restart/datasource';
import { makeDatasourceConfig } from '@restart/config';
import { wrapWithHttpTranslation } from '@restart/errors';
import { makeUserRepository } from '@restart/core-iam/src/infrastructure/persistence/repositories/user.repository.js';
import { makeRegisterUser } from '@restart/core-iam/src/application/use-cases/register-user.use-case.js';
import { makeLoginUser } from '@restart/core-iam/src/application/use-cases/login-user.use-case.js';
import { makeGetUserProfile } from '@restart/core-iam/src/application/use-cases/get-user-profile.use-case.js';
import { makeUsersController } from '@restart/core-iam/src/interfaces/http/users.controller.js';
import { createAuthRoutes, createUserRoutes } from '@restart/core-iam/src/interfaces/http/routes.js';
import { jwtSecret } from '../configs/app-config.js';

export const buildContainer = ({ datasourceConfig = makeDatasourceConfig(), translateHttpErrors = true } = {}) => {
  const { query } = makeDatasource(datasourceConfig);
  const wrap = translateHttpErrors ? wrapWithHttpTranslation : (fn) => fn;

  const userRepo = makeUserRepository({ query });

  const registerUser = makeRegisterUser({ userRepo });
  const loginUser = makeLoginUser({ userRepo, jwtSecret });
  const getUserProfile = makeGetUserProfile({ userRepo });

  const usersController = makeUsersController({ registerUser, loginUser, getUserProfile });
  const wrappedController = {
    register: wrap(usersController.register),
    login: wrap(usersController.login),
    getProfile: wrap(usersController.getProfile),
  };

  return {
    authRoutes: createAuthRoutes({ usersController: wrappedController }),
    userRoutes: createUserRoutes({ usersController: wrappedController }),
  };
};
