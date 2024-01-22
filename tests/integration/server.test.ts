import { app } from '../../app';
import supertest from 'supertest';
const request = supertest(app);
import Joi from 'joi';

describe('App', () => {
  afterAll(async () => {});

  it('should return app status with registered routes', (done) => {
    request
      .get('/api/v1/status')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        const appStatusSchema = Joi.object({
          status: Joi.string(),
          message: Joi.string(),
          data: Joi.object({
            info: Joi.object({
              name: Joi.string().required(),
              node_version: Joi.string().required(),
              app_version: Joi.string().required(),
            }).options({ allowUnknown: true }),
            routes: Joi.array(),
          }),
        });

        Joi.assert(response.body, appStatusSchema);
      })
      .expect(200)
      .end(done);
  });
});
