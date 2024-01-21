import mailer from '../../utils/email/sendEmail';
import { config } from '../../../config/config';
import { initConsumer } from '../../utils/amqplib';

const sendVerificationEmail: (...args: any) => void =
  mailer.sendVerificationEmail;

export const execEmailQueueWorker = async (): Promise<void> => {
  await initConsumer(sendVerificationEmail, config.amqp.verifyEmailQueue);
};
