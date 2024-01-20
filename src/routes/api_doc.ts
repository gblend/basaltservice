import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs';

const router: Router = Router();

const options: { explorer: boolean } = {
  explorer: false,
};

router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options),
);

export default router;
