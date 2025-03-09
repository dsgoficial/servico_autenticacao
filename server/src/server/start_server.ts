// Path: server\start_server.ts
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist';

import { databaseVersion } from '../database/index.js';
import app from './app.js';
import { logger, AppError } from '../utils/index.js';
import config, { VERSION } from '../config.js';
import { ServerInstance } from './server_types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const httpsConfig = (): ServerInstance => {
  const key = path.join(__dirname, 'sslcert/key.pem');
  const cert = path.join(__dirname, 'sslcert/cert.pem');

  if (!fs.existsSync(key) || !fs.existsSync(cert)) {
    throw new AppError(
      'Para executar o serviço no modo HTTPS é necessário criar a chave e certificado com OpenSSL. Verifique a Wiki do Serviço de Autenticação no Github para mais informações',
    );
  }

  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(key, 'utf8'),
      cert: fs.readFileSync(cert, 'utf8'),
    },
    app,
  );

  return httpsServer.listen(config.PORT, () => {
    logger.info('Servidor HTTPS do Servidor de Autenticação iniciado', {
      success: true,
      information: {
        version: VERSION,
        database_version: databaseVersion.nome,
        port: config.PORT,
      },
    });
  });
};

const httpConfig = (): ServerInstance => {
  return app.listen(config.PORT, () => {
    logger.info('Servidor HTTP do Servidor de Autenticação iniciado', {
      success: true,
      information: {
        version: VERSION,
        database_version: databaseVersion.nome,
        port: config.PORT,
      },
    });
  });
};

export const startServer = (): ServerInstance => {
  const argv = minimist(process.argv.slice(2));
  if ('https' in argv && argv.https) {
    return httpsConfig();
  }

  return httpConfig();
};
