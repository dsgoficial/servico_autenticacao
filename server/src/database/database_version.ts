// Path: database\database_version.ts
import semver from 'semver';
import db from './db.js';
import { AppError } from '../utils/index.js';
import { MIN_DATABASE_VERSION } from '../config.js';
import { DatabaseVersion } from './database_types.js';

const dbVersion: DatabaseVersion = {
  nome: undefined,

  load: async () => {
    if (!dbVersion.nome) {
      const dbv = await db.conn.oneOrNone<{ nome: string }>(
        'SELECT nome FROM public.versao',
      );

      if (!dbv) {
        throw new AppError(
          'O banco de dados não é compatível com a versão do serviço.',
        );
      }

      validate(dbv.nome);
      dbVersion.nome = dbv.nome;
    }
  },
};

const validate = (dbv: string): void => {
  if (
    semver.lt(
      semver.coerce(dbv) || '0.0.0',
      semver.coerce(MIN_DATABASE_VERSION) || '0.0.0',
    )
  ) {
    throw new AppError(
      `Versão do banco de dados (${dbv}) não compatível com o serviço. A versão deve ser superior a ${MIN_DATABASE_VERSION}.`,
    );
  }
};

export default dbVersion;
