import { config } from '../config/config';
const { prefix, baseUrl } = config.app;

export default {
  openapi: '3.0.0',
  info: {
    title: 'BasaltService API Documentation',
    description: 'Documentation for BasaltService APIs',
    version: '1.0.0',
    contact: {
      email: 'gabrielilo190@gmail.com',
      phone: '+2348166195490',
      url: 'https://gblend.tech',
    },
  },
  schemes: ['http', 'https'],

  servers: [
    {
      url: `${baseUrl}${prefix}`,
      description: 'Local Environment',
    },
    {
      url: `${baseUrl}${prefix}`,
      description: 'Production Environment',
    },
  ],
};
