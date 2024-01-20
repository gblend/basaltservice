import { logger } from '../../lib/utils';
import { CustomAPIError } from '../../lib/errors';
import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import { config } from '../config';

const modelsPath: string = path.join(__dirname, '../../', 'models');

type DatabaseConfig = {
  host: string;
  user: string;
  password: string;
  test: string;
  development: string;
  production: string;
  [key: string]: string;
};

const databaseConfig: DatabaseConfig = config.database;
const databaseName: string = databaseConfig[config.app.env];

const sequelize: Sequelize = new Sequelize({
  host: databaseConfig.host,
  database: databaseName,
  dialect: 'mysql',
  username: databaseConfig.user,
  password: databaseConfig.password,
  models: [modelsPath],
  logging: logger.debug.bind(logger),
  validateOnly: config.app.env === 'test',
});

export const dbConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
  } catch (error: any) {
    logger.error('Unable to connect to the database:', error.message);
    throw new CustomAPIError(`${error.message}`);
  }
};
