import winston, { Logger } from 'winston';
import { config } from '../../config/config';

const createLogger = (): Logger => {
  const _logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { service: 'basaltService-backend' },
    transports: [
      new winston.transports.File({
        filename: './logs/app.log',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
          winston.format.align(),
          winston.format.colorize({ colors: { warn: 'yellow' } }),
          winston.format.printf(
            (info: {
              level: string;
              timestamp?: string;
              message: string;
            }): string => `${info.level}: ${[info.timestamp]}: ${info.message}`,
          ),
        ),
      }),
      new winston.transports.File({
        level: 'error',
        filename: './logs/errors.log',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
          winston.format.align(),
          winston.format.colorize({ colors: { error: 'red' } }),
          winston.format.printf(
            (info: {
              level: string;
              timestamp?: string;
              message: string;
            }): string => `${info.level}: ${[info.timestamp]}: ${info.message}`,
          ),
        ),
      }),
    ],
  });

  if (config.app.env !== 'production') {
    _logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
          winston.format.align(),
          winston.format.colorize({ colors: { info: 'blue' } }),
          winston.format.printf(
            (info: {
              level: string;
              timestamp?: string;
              message: string;
            }): string => `${info.level}: ${[info.timestamp]}: ${info.message}`,
          ),
        ),
      }),
    );
  }

  return _logger;
};

export const logger = createLogger();
