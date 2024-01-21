import { createTransport } from 'nodemailer';
import { config } from '../../../config/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '../.env' });
const mail: {
  host: string;
  port: any;
  smtpSecure: boolean;
  authUser: string;
  authPassword: string;
} = config.app.prodEnv ? config.mail : config.mailTest;

const transporterInit = () => {
  return createTransport({
    host: mail.host,
    port: Number(mail.port),
    secure: mail.smtpSecure,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: mail.authUser,
      pass: mail.authPassword,
    },
  });
};

export const sendEmail = ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: any;
}) => {
  const from: string = config.mail.from;
  return transporterInit().sendMail({
    from,
    to,
    subject,
    html,
  });
};
