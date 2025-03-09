// Path: index.ts
import { errorHandler } from './utils/index.js';
import { startServer } from './server/index.js';
import { db, databaseVersion } from './database/index.js';

// Verify Node.js version
const version = process.versions.node.split('.');
const major = +version[0];
const minor = +version[1];

if (major < 16 || (major === 16 && minor < 15)) {
  throw new Error('Versão mínima do Node.js suportada pelo Serviço é 16.15');
}

// Initialize the application
async function init() {
  try {
    await db.createConn();
    await databaseVersion.load();
    await startServer();
  } catch (error) {
    errorHandler.critical(
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

init();
