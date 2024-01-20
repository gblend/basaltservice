import { config as dotenvConfig } from 'dotenv';

dotenvConfig();
type numberUnknown = number | unknown;
const currentEnv: string = process.env.NODE_ENV || 'development';
const isProdEnv: boolean = currentEnv === 'production';

export const config = {
  app: {
    port: process.env.PORT || (process.env.APP_PORT as numberUnknown),
    name: process.env.APP_NAME || 'basaltService',
    env: currentEnv,
    prodEnv: isProdEnv,
    baseUrl: isProdEnv
      ? process.env.BASE_URL_PROD
      : (process.env.BASE_URL_DEV as string),
    secret:
      process.env.APP_SECRET || ('basaltService:_xx_default_xx' as string),
    prefix: '/api/v1',
  },
  rateLimiter: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS as numberUnknown,
    max: process.env.RATE_LIMIT_MAX as unknown as number,
  },
  jwt: {
    secret:
      process.env.JWT_SECRET || ('basaltService:_xx_default_xx' as string),
    expiration: process.env.JWT_EXPIRATION as string,
  },
  mail: {
    host: process.env.MAIL_HOST as string,
    port: process.env.MAIL_PORT as numberUnknown,
    smtpSecure: process.env.NODE_ENV === 'production',
    authUser: process.env.MAIL_AUTH_USER as string,
    authPassword: process.env.MAIL_AUTH_PASSWORD as string,
    from: process.env.MAIL_FROM as string,
  },
  mailTest: {
    host: process.env.TEST_MAIL_HOST as string,
    port: process.env.TEST_MAIL_PORT as numberUnknown,
    smtpSecure: process.env.NODE_ENV === 'production',
    authUser: process.env.TEST_MAIL_AUTH_USER as string,
    authPassword: process.env.TEST_MAIL_AUTH_PASSWORD as string,
    from: process.env.TEST_MAIL_FROM as string,
  },
  amqp: {
    host: process.env.AMQP_SERVER_HOST || 'localhost',
    vhost: process.env.AMQP_SERVER_VHOST || '/',
    port: process.env.AMQP_SERVER_PORT || 5672,
    password: process.env.AMQP_SERVER_PASSWORD || 'guest',
    protocol: process.env.AMQP_SERVER_PROTOCOL || 'amqp',
    username: process.env.AMQP_SERVER_USERNAME || 'guest',
    verifyEmailQueue: process.env.VERIFY_EMAIL_QUEUE_NAME as string,
    defaultUser: process.env.AMQP_DEFAULT_USERNAME as string,
    defaultPass: process.env.AMQP_DEFAULT_PASSWORD as string,
  },
  days: {
    one: 60 * 60 * 24 * 1000,
    thirty: 60 * 60 * 24 * 1000 * 30,
  },
  minutes: {
    ten: 1000 * 10 * 60,
    five: 1000 * 5 * 60,
    fiftyFive: 1000 * 55 * 60,
  },
  hours: {
    one: 1000 * 60 * 60,
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    test: process.env.TEST_DATABASE_NAME as string,
    development: process.env.DEVELOPMENT_DATABASE_NAME as string,
    production: process.env.DATABASE_NAME as string,
  },
  api: {
    xRapidApiKey: process.env.X_RAPIDAPI_KEY || '',
    xRapidApiCountriesHost: process.env.X_RAPIDAPI_COUNTRIES_HOST,
    xRapidApiCountriesUrl: process.env.X_RAPIDAPI_COUNTRIES_URL,
    xRapidApiHolidaysHost: process.env.X_RAPIDAPI_HOLIDAYS_HOST,
    xRapidApiHolidaysUrl: process.env.X_RAPIDAPI_HOLIDAYS_URL,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || (6379 as number),
    password: process.env.REDIS_PASSWORD || ('' as string),
    db: process.env.REDIS_DB || (0 as number),
    family: process.env.REDIS_FAMILY || (4 as number),
  },
};
