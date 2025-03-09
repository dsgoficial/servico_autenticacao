// Path: usuarios\usuario_ctrl.ts
import bcrypt from 'bcryptjs';
import { db } from '../database/index.js';
import { AppError, HttpCode } from '../utils/index.js';
import { loginController } from '../login/index.js';
import { SQL } from './usuario_sql.js';
import { Usuario, TipoPostoGrad, TipoTurno } from './usuario_types.js';

interface UsuarioLogin {
  id: number;
  login: string;
}

const controller = {
  resetaSenhaUsuarios: async (usuariosUUID: string[]): Promise<void> => {
    await db.conn.tx(async t => {
      // Using type assertion after method call
      const logins = (await t.any(SQL.GET_NON_ADMIN_USERS, {
        usuariosUUID,
      })) as UsuarioLogin[];

      if (!logins || logins.length === 0) {
        throw new AppError('Usuários não encontrados', HttpCode.NotFound);
      }

      const cs = new db.pgp.helpers.ColumnSet(['?id', 'senha']);

      const values = [];

      for (const { id, login } of logins) {
        const senha = await bcrypt.hash(login, 10);
        values.push({
          id,
          senha,
        });
      }

      const query =
        db.pgp.helpers.update(
          values,
          cs,
          { table: 'usuario', schema: 'dgeo' },
          {
            tableAlias: 'X',
            valueAlias: 'Y',
          },
        ) + 'WHERE Y.id = X.id';

      await t.none(query);
    });
  },

  modificaAutorizacao: async (
    usuariosUUID: string[],
    ativo: boolean,
  ): Promise<void> => {
    await db.conn.none(SQL.UPDATE_USER_AUTHORIZATION, { usuariosUUID, ativo });
  },

  getTipoPostoGrad: async (): Promise<TipoPostoGrad[]> => {
    return db.conn.any<TipoPostoGrad>(SQL.GET_TIPO_POSTO_GRAD);
  },

  getTipoTurno: async (): Promise<TipoTurno[]> => {
    return db.conn.any<TipoTurno>(SQL.GET_TIPO_TURNO);
  },

  getUsuariosCompleto: async (): Promise<Usuario[]> => {
    return db.conn.any<Usuario>(SQL.GET_USUARIOS_COMPLETO);
  },

  criaUsuarioCompleto: async (
    login: string,
    senha: string,
    nome: string,
    nomeGuerra: string,
    tipoPostoGradId: number,
    tipoTurnoId: number,
    ativo: boolean,
    administrador: boolean,
    uuid?: string,
  ): Promise<void> => {
    const usuarioExiste = await db.conn.oneOrNone(SQL.CHECK_USER_EXISTS, {
      login,
    });

    if (usuarioExiste) {
      throw new AppError(
        'Usuário com esse login já existe',
        HttpCode.BadRequest,
      );
    }

    const hash = await bcrypt.hash(senha, 10);

    if (uuid) {
      await db.conn.none(SQL.CREATE_USER_WITH_UUID, {
        login,
        hash,
        nome,
        nomeGuerra,
        tipoPostoGradId,
        tipoTurnoId,
        ativo,
        administrador,
        uuid,
      });
    } else {
      await db.conn.none(SQL.CREATE_USER, {
        login,
        hash,
        nome,
        nomeGuerra,
        tipoPostoGradId,
        tipoTurnoId,
        ativo,
        administrador,
      });
    }
  },

  updateUsuarioCompleto: async (
    uuid: string,
    login: string,
    nome: string,
    nomeGuerra: string,
    tipoPostoGradId: number,
    tipoTurnoId: number,
    ativo: boolean,
    administrador: boolean,
    novoUuid: string,
  ): Promise<void> => {
    if (!administrador) {
      const ultimoAdministrador = await db.conn.oneOrNone(
        SQL.CHECK_OTHER_ADMIN_EXISTS,
        { login },
      );

      if (!ultimoAdministrador) {
        throw new AppError(
          'Este usuário é o último administrador do sistema',
          HttpCode.BadRequest,
        );
      }
    }

    const result = await db.conn.result(SQL.UPDATE_USER_COMPLETE, {
      uuid,
      login,
      nome,
      nomeGuerra,
      tipoPostoGradId,
      tipoTurnoId,
      ativo,
      administrador,
      novoUuid,
    });

    if (!result.rowCount || result.rowCount < 1) {
      throw new AppError('Usuário não encontrado', HttpCode.NotFound);
    }
  },

  updateSenha: async (
    uuid: string,
    senhaAtual: string,
    senhaNova: string,
  ): Promise<void> => {
    await loginController.verifyPassword(uuid, senhaAtual);

    const hash = await bcrypt.hash(senhaNova, 10);

    const result = await db.conn.result(SQL.UPDATE_USER_PASSWORD_BY_UUID, {
      uuid,
      hash,
    });

    if (!result.rowCount || result.rowCount < 1) {
      throw new AppError('Usuário não encontrado', HttpCode.NotFound);
    }
  },

  updateUsuario: async (
    uuid: string,
    nome: string,
    nomeGuerra: string,
    tipoPostoGradId: number,
    tipoTurnoId: number,
  ): Promise<void> => {
    const result = await db.conn.result(SQL.UPDATE_USER, {
      uuid,
      nome,
      nomeGuerra,
      tipoPostoGradId,
      tipoTurnoId,
    });

    if (!result.rowCount || result.rowCount < 1) {
      throw new AppError('Usuário não encontrado', HttpCode.NotFound);
    }
  },

  deletaUsuario: async (uuid: string): Promise<void> => {
    await db.conn.tx(async t => {
      const adm = await t.oneOrNone(SQL.CHECK_USER_IS_ADMIN, { uuid });

      if (adm) {
        throw new AppError(
          'Usuário com privilégio de administrador não pode ser deletado',
          HttpCode.BadRequest,
        );
      }

      await t.none(SQL.NULLIFY_USER_LOGIN_REFERENCES, { uuid });

      const result = await t.result(SQL.DELETE_USER, { uuid });

      if (!result.rowCount || result.rowCount < 1) {
        throw new AppError('Usuário não encontrado', HttpCode.NotFound);
      }
    });
  },

  getUsuario: async (uuid: string): Promise<Usuario> => {
    const usuario = await db.conn.oneOrNone<Usuario>(SQL.GET_USER_BY_UUID, {
      uuid,
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', HttpCode.BadRequest);
    }

    return usuario;
  },

  getUsuarios: async (): Promise<Usuario[]> => {
    return db.conn.any<Usuario>(SQL.GET_USUARIOS);
  },

  criaUsuario: async (
    login: string,
    senha: string,
    nome: string,
    nomeGuerra: string,
    tipoPostoGradId: number,
    tipoTurnoId: number,
  ): Promise<void> => {
    const usuarioExiste = await db.conn.oneOrNone(SQL.CHECK_USER_EXISTS, {
      login,
    });

    if (usuarioExiste) {
      throw new AppError(
        'Usuário com esse login já existe',
        HttpCode.BadRequest,
      );
    }

    const hash = await bcrypt.hash(senha, 10);

    await db.conn.none(SQL.CREATE_REGULAR_USER, {
      login,
      hash,
      nome,
      nomeGuerra,
      tipoPostoGradId,
      tipoTurnoId,
    });
  },
};

export default controller;
