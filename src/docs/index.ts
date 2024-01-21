import schemas from './schemas';
import paths from './paths';
import generalSetup from './general';

export default {
  ...generalSetup,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    ...schemas,
    headers: {
      contentType: 'application/json',
      accept: 'application/json',
    },
  },
  ...paths,
};
