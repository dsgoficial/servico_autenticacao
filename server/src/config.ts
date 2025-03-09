// Path: config.ts
import dotenv from 'dotenv';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { AppError, HttpCode } from './utils/index.js';
import errorHandler from './utils/error_handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configFile =
  process.env.NODE_ENV === 'test' ? 'config_testing.env' : 'config.env';

const configPath = path.join(__dirname, '..', configFile);

// First try to load from config file, but don't fail if it doesn't exist
if (fs.existsSync(configPath)) {
  dotenv.config({
    path: configPath
  });
} else {
  console.log(`Config file ${configPath} not found. Using environment variables instead.`);
}

export const VERSION = '1.0.0';
export const MIN_DATABASE_VERSION = '1.0.0';

// Define the config schema with Zod
const configSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  DB_SERVER: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  VERSION: z.string().min(1),
  MIN_DATABASE_VERSION: z.string().min(1)
});

// Infer the type from the schema
type Config = z.infer<typeof configSchema>;

// Create config object with defaults
const rawConfig = {
  PORT: process.env.PORT,
  DB_SERVER: process.env.DB_SERVER,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
  VERSION,
  MIN_DATABASE_VERSION
};

// Validate and parse the config
let config: Config;
try {
  config = configSchema.parse(rawConfig);
} catch (error) {
  // Handle validation errors from Zod
  if (error instanceof z.ZodError) {
    const details = error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    ).join(', ');
    
    errorHandler.critical(
      new AppError(
        `Configuração inválida. Configure novamente o serviço. Detalhes: ${details}`,
        HttpCode.InternalError,
        new Error(details)
      )
    );
  }
  
  // Handle other types of errors
  errorHandler.critical(
    new AppError(
      'Erro inesperado ao validar configuração.',
      HttpCode.InternalError,
      error instanceof Error ? error : new Error(String(error))
    )
  );
  
  // This will never execute due to errorHandler.critical, but TypeScript needs it
  throw new Error('Configuration validation failed');
}

export default config;