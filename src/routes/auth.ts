import { Router } from 'express';

import {
  getAllUsers,
  getRoles,
  getUser,
  login,
  logout,
  register,
  verifyEmail,
} from '../controllers';

import { constants } from '../lib/utils';
const { ADMIN: admin, USER: user } = constants.role;

import { authenticateUser, authorizeRoles } from '../middleware';
const router: Router = Router();

router.route('/login').post(login);
router.route('/logout').delete(authenticateUser, logout);
router.route('/verify-account').post(verifyEmail);
router
  .route('/users')
  .get(authenticateUser, authorizeRoles(admin), getAllUsers);
router.route('/signup').post(register);
router.route('/roles').get(getRoles);
router
  .route('/users/:id')
  .get(authenticateUser, authorizeRoles(admin, user), getUser);

export default router;
