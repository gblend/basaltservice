import healthEndpoints from './health/status';
import authEndpoints from './auth';

export default {
  paths: {
    ...healthEndpoints,
    ...authEndpoints,
  },
};
