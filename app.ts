import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './src/config/config';
import express, { Application } from 'express';
import { createServer } from 'http';
import { logger, serverStatus, xss } from './src/lib/utils';
import {
  errorHandler,
  eventHandler,
  responseInterceptor,
  routeNotFound,
} from './src/middleware';
import { apiDocRouter, authRouter, countryRouter } from './src/routes';

export { initCron } from './src/scheduler';
export { dbConnection } from './src/config/db/connect';
const { env: appEnv, prefix, prodEnv } = config.app;

const app: Application = express();
const httpServer = createServer(app);

const apiRateLimiter = rateLimit({
  windowMs: config.rateLimiter.windowMs,
  max: config.rateLimiter.max,
  standardHeaders: prodEnv,
});

app.use('/api', apiRateLimiter);
app.use(helmet());
app.use(xss());
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
if (appEnv === 'development') app.use(morgan('dev'));

app.get(`${prefix}/status`, serverStatus);
app.use(responseInterceptor);
app.use('/', apiDocRouter);
app.use(`${prefix}/auth`, authRouter);
app.use(`${prefix}/countries`, countryRouter);

app.use(routeNotFound);
app.use(errorHandler);

process
  .on('SIGTERM', eventHandler('SIGTERM'))
  .on('unhandledRejection', eventHandler('unhandledRejection'))
  .on('uncaughtException', eventHandler('uncaughtException'));

export { logger, config, httpServer, appEnv, app };
