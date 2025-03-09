// Path: aplicacoes\aplicacao_ctrl.ts
import { db } from '../database/index.js';
import { AppError, HttpCode } from '../utils/index.js';
import { SQL } from './aplicacao_sql.js';
import { Aplicacao } from './aplicacao_types.js';

const controller = {
  getAplicacao: async (): Promise<Aplicacao[]> => {
    return db.conn.any<Aplicacao>(SQL.GET_APLICACAO);
  },

  deletaAplicacao: async (id: number): Promise<void> => {
    return db.conn.tx(async t => {
      const aplicacaoDefault = await t.oneOrNone(SQL.CHECK_DEFAULT_APLICACAO, {
        id,
      });

      if (aplicacaoDefault) {
        throw new AppError(
          'As aplicações padrão não devem ser deletadas',
          HttpCode.BadRequest,
        );
      }

      await t.none(SQL.UPDATE_LOGIN_NULL_APLICACAO, { id });

      const result = await t.result(SQL.DELETE_APLICACAO, { id });

      if (!result.rowCount || result.rowCount < 1) {
        throw new AppError('Aplicação não encontrada', HttpCode.NotFound);
      }
    });
  },

  criaAplicacao: async (
    nome: string,
    nomeAbrev: string,
    ativa: boolean,
  ): Promise<void> => {
    return db.conn.tx(async t => {
      ativa = Boolean(ativa);

      const existe = await t.oneOrNone(SQL.CHECK_APLICACAO_EXISTS, {
        nome,
        nomeAbrev,
      });

      if (existe) {
        throw new AppError(
          'Aplicação com esse nome ou nome_abrev já existe',
          HttpCode.BadRequest,
        );
      }

      t.none(SQL.INSERT_APLICACAO, { nome, nomeAbrev, ativa });
    });
  },

  updateAplicacao: async (
    id: number,
    nome: string,
    nomeAbrev: string,
    ativa: boolean,
  ): Promise<void> => {
    return db.conn.tx(async t => {
      ativa = Boolean(ativa);

      const existe = await t.oneOrNone(SQL.GET_APLICACAO_BY_ID, { id });

      if (!existe) {
        throw new AppError(
          'Id não corresponde a nenhuma aplicação',
          HttpCode.NotFound,
        );
      }

      const colisao = await t.oneOrNone(SQL.CHECK_APLICACAO_COLLISION, {
        id,
        nome,
        nomeAbrev,
      });

      if (colisao) {
        throw new AppError(
          'Aplicação com esse nome ou nome_abrev já existe',
          HttpCode.BadRequest,
        );
      }

      const aplicacaoDefault = await t.oneOrNone(
        SQL.CHECK_DEFAULT_APLICACAO_FOR_UPDATE,
        { id, nome, nomeAbrev },
      );

      if (aplicacaoDefault) {
        throw new AppError(
          'O nome e nome_abrev de aplicações padrão não devem ser modificados',
          HttpCode.BadRequest,
        );
      }

      const aplicacaoAuth = await t.oneOrNone(SQL.CHECK_AUTH_APLICACAO, { id });

      if (aplicacaoAuth && !ativa) {
        throw new AppError(
          'O cliente web do serviço de autenticação não pode ser desativado',
          HttpCode.BadRequest,
        );
      }

      t.none(SQL.UPDATE_APLICACAO, { id, nome, nomeAbrev, ativa });
    });
  },
};

export default controller;
