export default {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      description: 'The request status',
      example: 'success',
    },
    message: {
      type: 'string',
      description: 'The response message',
      example: 'basaltService backend is running.',
    },
    data: {
      type: 'object',
      properties: {
        info: {
          type: 'object',
          example: {
            app_version: '1.0.0',
          },
        },
        routes: {
          type: 'array',
          description: 'The application routes',
          example: ['GET    /api/v1/status'],
        },
      },
    },
  },
};
