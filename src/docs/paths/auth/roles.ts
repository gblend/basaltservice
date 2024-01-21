export default {
  '/auth/roles': {
    get: {
      tags: ['Auth'],
      description: 'Get user roles',
      summary: 'gets user roles',
      operationId: 'userRoles',
      responses: {
        '200': {
          description: 'User roles successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'User roles fetched successfully',
                data: {
                  roles: [
                    {
                      id: 1,
                      name: 'user',
                    },
                    {
                      id: 2,
                      name: 'admin',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
};
