// Path: database\database_types.ts
import pgPromise from 'pg-promise';

export interface DatabaseVersion {
  nome?: string;
  load: () => Promise<void>;
}

export interface DatabaseInterface {
  pgp: pgPromise.IMain;
  conn: pgPromise.IDatabase<any>;
  createConn: () => Promise<void>;
}
