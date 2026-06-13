// Path: database\db.ts
import pgPromise from 'pg-promise';
import promise from 'bluebird';
import config from '../config.js';
import { DatabaseInterface } from './database_types.js';

const { DB_USER, DB_PASSWORD, DB_SERVER, DB_PORT, DB_NAME } = config;

/**
 * Database class implementing the DatabaseInterface
 */
class Database implements DatabaseInterface {
  public pgp: pgPromise.IMain;
  public conn!: pgPromise.IDatabase<any>; // The ! operator tells TypeScript this will be initialized before use

  constructor() {
    this.pgp = pgPromise({
      promiseLib: promise,
    });
  }

  async createConn(): Promise<void> {
    const cn = {
      host: DB_SERVER,
      port: DB_PORT,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
    };

    const conn = this.pgp(cn);

    // Testa a conexão e só expõe `this.conn` em caso de sucesso. Se a conexão
    // falhar, o erro é propagado para o init() (index.ts), que loga e encerra
    // via errorHandler.critical — evitando seguir a inicialização com uma
    // conexão inválida e sem chamar critical em dois lugares.
    const obj = await conn.connect();
    obj.done(); // sucesso, libera a conexão de teste

    this.conn = conn;
  }
}

const db = new Database();
export default db;
