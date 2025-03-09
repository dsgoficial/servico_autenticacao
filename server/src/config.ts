// Path: config.ts
import dotenv from 'dotenv';
import Joi from 'joi';
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

if (!fs.existsSync(configPath)) {
  errorHandler.critical(
    new AppError(
      'Arquivo de configuração não encontrado. Configure o serviço primeiro.',
    ),
  );
}

dotenv.config({
  path: configPath,
});

export const VERSION = '1.0.0';
export const MIN_DATABASE_VERSION = '1.0.0';

interface Config {
  PORT: number;
  DB_SERVER: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
  VERSION: string;
  MIN_DATABASE_VERSION: string;
}

const configSchema = Joi.object<Config>({
  PORT: Joi.number().integer().required(),
  DB_SERVER: Joi.string().required(),
  DB_PORT: Joi.number().integer().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  VERSION: Joi.string().required(),
  MIN_DATABASE_VERSION: Joi.string().required(),
});

const config: Config = {
  PORT: Number(process.env.PORT),
  DB_SERVER: process.env.DB_SERVER || '',
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME || '',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  VERSION,
  MIN_DATABASE_VERSION,
};

const { error } = configSchema.validate(config, {
  abortEarly: false,
});

if (error) {
  const { details } = error;
  const message = details.map(i => i.message).join(',');

  errorHandler.critical(
    new AppError(
      'Arquivo de configuração inválido. Configure novamente o serviço.',
      HttpCode.InternalError,
      new Error(message),
    ),
  );
}

export default config;
