import signUp from './signup';
import verifyAccount from './verify_account';
import login from './login';
import logout from './logout';
import userDetails from './user';
import userRoles from './roles';
import users from './users';

export default {
  ...verifyAccount,
  ...login,
  ...logout,
  ...signUp,
  ...userDetails,
  ...userRoles,
  ...users,
};
