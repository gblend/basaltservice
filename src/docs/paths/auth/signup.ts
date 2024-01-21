export default {
  '/auth/signup': {
    post: {
      tags: ['Auth'],
      description: 'Register a new user',
      summary: 'registers a new user',
      operationId: 'signUp',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SignupInput',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'New user signup successful response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SignupSuccess',
              },
            },
          },
        },
        '400': {
          description: 'New user signup error response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SignupError',
              },
            },
          },
        },
      },
    },
  },
};
