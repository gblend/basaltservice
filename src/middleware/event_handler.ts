import { logger } from '../lib/utils';

export const eventHandler = (event: string) => {
  return (err: any) => {
    switch (event) {
      case 'SIGTERM':
      case 'uncaughtException':
        logger.error(`${event} - closing http server: ${err?.message}`);
        return process.exit(err ? 1 : 0);
      case 'unhandledRejection':
      default:
        logger.error(`${event} - ${err?.message}`);
    }
  };
};
