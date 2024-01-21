export default {
  '/auth/logout': {
    delete: {
      tags: ['Auth'],
      description: 'Logout user',
      summary: 'logs out user',
      operationId: 'logout',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        '204': {
          description: 'User logout successful response',
          content: {
            'application/json': {},
          },
        },
        '401': {
          description: 'User logout error response',
          content: {
            'application/json': {
              example: {
                status: 'error',
                message: 'Request failed',
                data: {
                  errors: ['Authentication invalid.'],
                },
              },
            },
          },
        },
      },
    },
  },
};
