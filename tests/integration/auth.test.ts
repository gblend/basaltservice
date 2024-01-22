import appServer from '../../server';
import Joi from 'joi';
import User from '../../src/models/User';
import supertest from 'supertest';
const request = supertest(appServer);
import { IUser } from '../../src/interface';

describe.skip('auth', () => {
  interface ITestData {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
    roleId?: number;
    token?: string;
  }

  interface ITestUser extends IUser {
    user?: any;
    data?: any;
  }

  let testUser: ITestUser = {};
  let data: ITestData = {};
  let loginTokens: string[] = [];
  let verificationToken: string = '';

  beforeEach(() => {
    data = {
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      password: 'password',
      roleId: 1,
      passwordConfirmation: 'password',
    };
  });

  afterAll(async () => {});

  it('should successfully register a user', (done) => {
    request
      .post('/api/v1/auth/signup')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        testUser = response.body;

        const registeredUser = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            token: Joi.string().required(),
            refreshToken: Joi.string().required(),
            user: Joi.object({
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
              roleId: Joi.number(),
              isVerified: Joi.boolean(),
              createdAt: Joi.date().required(),
              updatedAt: Joi.date().required(),
            }).options({ allowUnknown: true }),
          }),
        });

        Joi.assert(testUser, registeredUser);
      })
      .end(done);
  });

  it('should fail registration due to duplicate email', (done) => {
    request
      .post('/api/v1/auth/signup')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((res: any) => {
        const registrationError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(res.body, registrationError);
      })
      .end(done);
  });

  it('should fail registration due to incomplete parameters', (done) => {
    request
      .post('/api/v1/auth/signup')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((res: any) => {
        const registrationError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(res.body, registrationError);
      })
      .end(done);
  });

  it('should successfully login a user with valid credentials', (done) => {
    data = {
      email: 'test@example.com',
      password: 'password',
    };

    request
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        loginTokens = response.headers['set-cookie'];

        const loggedInUser = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            verificationMsg: Joi.string().required(),
            token: Joi.string().required(),
            refreshToken: Joi.string().required(),
            user: Joi.object(testUser.user).options({ allowUnknown: true }),
          }),
        });

        Joi.assert(response.body, loggedInUser);
      })
      .end(done);
  });

  it('should fail to login with invalid parameters', (done) => {
    request
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        const loginError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(response.body, loginError);
      })
      .end(done);
  });

  it('should fail to login with invalid email', (done) => {
    data = {
      email: 'test@example1.com',
      password: 'password',
    };

    request
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        const loginError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(response.body, loginError);
      })
      .end(done);
  });

  it('should fail to login with invalid password', (done) => {
    data = {
      email: 'test@example.com',
      password: 'password1',
    };

    request
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .expect((response: any) => {
        const loginError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(response.body, loginError);
      })
      .end(done);
  });

  it('should successfully logout user with valid token', (done) => {
    request
      .delete('/api/v1/auth/logout')
      .set('Cookie', loginTokens)
      .expect(204)
      .expect((response: any) => {
        expect(response.body).toEqual({});
      })
      .end(done);
  });

  it('should fail to logout user with invalid token', (done) => {
    request
      .delete('/api/v1/auth/logout')
      .set('Cookie', [])
      .expect(401)
      .expect((response: any) => {
        const loginError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(response.body, loginError);
      })
      .end(done);
  });

  it('should successfully verify user with valid email and token', async () => {
    const user = await User.findOne({ where: { id: testUser.data.user.id } });
    verificationToken = user?.verificationToken ?? '';

    data = {
      email: user?.email,
      token: verificationToken,
    };

    const res = await request
      .post('/api/v1/auth/verify-account')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    const verifyEmailSchema = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({}).required(),
    });

    Joi.assert(res.body, verifyEmailSchema);
  });

  it('should fail to verify user with invalid email', async () => {
    data = {
      email: 'test@example1.com',
      token: verificationToken,
    };

    const response = await request
      .post('/api/v1/auth/verify-account')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(401)
      .expect('Content-Type', 'application/json; charset=utf-8');

    const verifyEmailErrorSchema = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({
        errors: Joi.array().min(1).required(),
      }),
    });

    Joi.assert(response.body, verifyEmailErrorSchema);
  });

  it('should fail to verify user with invalid token', async () => {
    data = {
      email: testUser.data.user.email,
      token: verificationToken,
    };

    const res = await request
      .post('/api/v1/auth/verify-account')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(401);

    const verifyEmailErrorSchema = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({
        errors: Joi.array().min(1).required(),
      }),
    });

    Joi.assert(res.body, verifyEmailErrorSchema);
  });
});
