// Path: login\login_ctrl.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../database/index.js';
import { AppError, HttpCode } from '../utils/index.js';
import config from '../config.js';
import { SQL } from './login_sql.js';
import { LoginResult } from './login_types.js';

const { JWT_SECRET } = config;

interface UsuarioDb {
  id: number;
  uuid: string;
  administrador: boolean;
  senha: string;
}

interface AplicacaoDb {
  id: number;
}

const gravaLogin = async (
  usuarioId: number,
  aplicacaoId: number,
  connection: any,
): Promise<any> => {
  return connection.any(SQL.RECORD_LOGIN, { usuarioId, aplicacaoId });
};

const signJWT = (data: object, secret: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      secret,
      {
        expiresIn: '1h',
      },
      (err, token) => {
        if (err) {
          reject(
            new AppError('Erro durante a assinatura do token', undefined, err),
          );
        }
        resolve(token as string);
      },
    );
  });
};

const comparePassword = (
  senhaFornecida: string,
  senhaDb: string,
): Promise<boolean> => {
  return bcrypt.compare(senhaFornecida, senhaDb);
};

const controller = {
  login: async (
    usuario: string,
    senha: string,
    aplicacao: string,
  ): Promise<LoginResult> => {
    return db.conn.tx(async t => {
      const aplicacaoId = (await t.oneOrNone(SQL.GET_APLICACAO, {
        aplicacao,
      })) as AplicacaoDb | null;

      if (!aplicacaoId) {
        throw new AppError(
          'Aplicação fornecida não pode utilizar o serviço de autenticação',
          HttpCode.BadRequest,
        );
      }

      const usuarioDb = (await t.oneOrNone(SQL.GET_USER, {
        usuario,
      })) as UsuarioDb | null;

      if (!usuarioDb) {
        throw new AppError(
          'Usuário não autorizado para utilizar o Serviço de Autenticação',
          HttpCode.BadRequest,
        );
      }

      const correctPassword = await comparePassword(senha, usuarioDb.senha);
      if (!correctPassword) {
        throw new AppError('Usuário ou senha inválida', HttpCode.BadRequest);
      }

      const { id, uuid, administrador } = usuarioDb;

      const token = await signJWT({ id, uuid, administrador }, JWT_SECRET);

      await gravaLogin(id, aplicacaoId.id, t);

      return { token, administrador, uuid };
    });
  },

  verifyPassword: async (uuid: string, senha: string): Promise<void> => {
    const usuarioDb = await db.conn.oneOrNone<UsuarioDb>(SQL.GET_USER_BY_UUID, {
      uuid,
    });

    if (!usuarioDb) {
      throw new AppError(
        'Usuário não autorizado para utilizar o Serviço de Autenticação',
        HttpCode.BadRequest,
      );
    }

    const correctPassword = await comparePassword(senha, usuarioDb.senha);
    if (!correctPassword) {
      throw new AppError('Usuário ou senha inválida', HttpCode.BadRequest);
    }
  },
};

export default controller;
