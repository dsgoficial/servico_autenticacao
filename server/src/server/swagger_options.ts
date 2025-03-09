// Path: server\swagger_options.ts
import { SwaggerOptions } from './server_types.js';

const swaggerOptions: SwaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Serviço de Autenticação',
      version: '0.0.1',
      description: 'API HTTP para utilização do Serviço de Autenticação',
    },
  },
  apis: ['./src/**/*.{js,ts}'],
};

export default swaggerOptions;
