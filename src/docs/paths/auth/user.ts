import partials from '../partials';

export default {
  '/auth/users/{id}': {
    get: {
      tags: ['Auth'],
      description: 'Get user by id',
      summary: 'gets user by id',
      operationId: 'userDetails',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'User id',
          required: true,
          type: 'number',
          example: 123,
        },
      ],
      responses: {
        '200': {
          description: 'User profile details successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Account details fetched successfully',
                data: {
                  user: partials.authUser,
                },
              },
            },
          },
        },
      },
    },
  },
};
