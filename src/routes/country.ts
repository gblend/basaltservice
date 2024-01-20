import { Router } from 'express';
import { authenticateUser } from '../middleware';
import { getCountries, getCountryDetails } from '../controllers';

const router: Router = Router();

router.route('/').get(authenticateUser, getCountries);
router.route('/:countryCode').get(authenticateUser, getCountryDetails);

export default router;
