export default {
  '/auth/verify-account': {
    post: {
      tags: ['Auth'],
      description: 'Verify account',
      summary: 'verify registered account',
      operationId: 'verifyAccount',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/VerifyAccountInput',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successful account verification response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Account successfully verified',
                data: {},
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized verify account error response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Request failed',
                data: {
                  errors: ['Verification failed, invalid token'],
                },
              },
            },
          },
        },
      },
    },
  },
};
