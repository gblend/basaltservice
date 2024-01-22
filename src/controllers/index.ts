import { authController } from './auth';
import { countryController } from './country';

export const {
  register,
  login,
  logout,
  verifyEmail,
  getUser,
  getAllUsers,
  getRoles,
} = authController;

export const { getCountries, getCountryDetails } = countryController;
