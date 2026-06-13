import { vi } from 'vitest';

// O config.ts valida as variáveis de ambiente no momento do import e chama
// errorHandler.critical (process.exit) se faltarem. Definimos valores válidos
// ANTES de qualquer import do código-fonte para que os módulos carreguem.
// dotenv não sobrescreve variáveis já existentes, então estes valores vencem.
process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT ?? '3010';
process.env.DB_SERVER = process.env.DB_SERVER ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_test';
process.env.DB_USER = process.env.DB_USER ?? 'test';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'test';
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? 'test-secret-nao-usar-em-producao';

// O logger (winston + DailyRotateFile) cria a pasta `logs/`, abre handles de
// arquivo e escreve no console já no import. Mockamos globalmente para que os
// testes não tenham efeitos colaterais em disco nem ruído de saída.
vi.mock('../src/utils/logger.js', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    log: vi.fn(),
    on: vi.fn(),
    end: vi.fn(),
  },
}));
