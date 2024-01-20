import 'express-async-errors';
import { config, dbConnection, httpServer, initCron, logger } from './app';
const { port, baseUrl, name, env } = config.app;

const start = (): void => {
  dbConnection()
    .then((_connection: any): void => {
      httpServer.listen(port, (): void => {
        logger.info(
          `${name} server running: ${baseUrl}\n API documentation: ${baseUrl}/api-docs`,
        );
      });
      initCron();
    })
    .catch((err: Error) => logger.error(err.message));
};
start();

export default httpServer;
