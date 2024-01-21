export default {
  '/status': {
    get: {
      tags: ['Health'],
      description: 'Get backend service status',
      summary: 'returns service status',
      operationId: 'getHealthStatus',
      responses: {
        200: {
          description: 'Backend service status returned successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/HealthStatus',
              },
            },
          },
        },
      },
    },
  },
};
