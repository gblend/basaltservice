import healthStatus from './health_status';
import auth from './auth';

export default {
  schemas: {
    HealthStatus: healthStatus,
    User: auth.model,
    SignupInput: auth.signupInput,
    SignupSuccess: auth.signupSuccess,
    SignupError: auth.signupError,
    VerifyAccountInput: auth.VerifyAccountInput,
    LoginInput: auth.LoginInput,
  },
};
