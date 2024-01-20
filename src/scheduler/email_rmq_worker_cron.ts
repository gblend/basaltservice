import cron from 'node-cron';
import { logger } from '../lib/utils';
import { execEmailQueueWorker } from '../lib/scripts/worker/email';

export const rabbitMQEmailWorker = (): void => {
  return cron.schedule('*/15 * * * *', async (): Promise<void> => {
    logger.info('Starting email queue worker...');
    await execEmailQueueWorker();
  });
};
