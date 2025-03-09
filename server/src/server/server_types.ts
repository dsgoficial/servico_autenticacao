// Path: server\server_types.ts
import { Server } from 'http';
import { Server as HttpsServer } from 'https';

export interface SwaggerOptions {
  swaggerDefinition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description: string;
    };
  };
  apis: string[];
}

export type ServerInstance = Server | HttpsServer;
