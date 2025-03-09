// Path: dashboard\dashboard_ctrl.ts
import { db } from '../database/index.js';
import { SQL } from './dashboard_sql.js';
import {
  UsuarioLogado,
  LoginDia,
  LoginMes,
  LoginAplicacao,
  LoginUsuario,
  AplicacaoLoginCount,
  UsuarioLoginCount,
} from './dashboard_types.js';

const controller = {
  getUsuariosLogados: async (): Promise<UsuarioLogado[]> => {
    return db.conn.any<UsuarioLogado>(SQL.GET_USUARIOS_LOGADOS);
  },

  getUsuariosAtivos: async (): Promise<number> => {
    const result = await db.conn.one<{ count: number }>(
      SQL.GET_USUARIOS_ATIVOS,
    );
    return result.count;
  },

  getAplicacoesAtivas: async (): Promise<number> => {
    const result = await db.conn.one<{ count: number }>(
      SQL.GET_APLICACOES_ATIVAS,
    );
    return result.count;
  },

  getLoginsDia: async (total = 14): Promise<LoginDia[]> => {
    const result = await db.conn.any<LoginDia>(SQL.GET_LOGINS_DIA, {
      total: total - 1,
    });
    result.forEach(r => {
      r.logins = +r.logins;
    });

    return result;
  },

  getLoginsMes: async (total = 12): Promise<LoginMes[]> => {
    const result = await db.conn.any<LoginMes>(SQL.GET_LOGINS_MES, {
      total: total - 1,
    });

    result.forEach(r => {
      r.logins = +r.logins;
    });

    return result;
  },

  getLoginsAplicacoes: async (
    total = 14,
    max = 10,
  ): Promise<LoginAplicacao[]> => {
    const aplicacoes = await db.conn.any<AplicacaoLoginCount>(
      SQL.GET_APLICACOES_WITH_LOGINS,
      { total: total - 1, max: max - 1 },
    );

    const dados = await db.conn.any<{
      data_login: Date;
      aplicacao: string;
      logins: string;
    }>(SQL.GET_LOGINS_APLICACOES_BY_DAY, { total: total - 1 });

    const aplicacoesFixed: string[] = [];
    aplicacoes.forEach(a => aplicacoesFixed.push(a.aplicacao));

    const resultDict: { [key: string]: LoginAplicacao } = {};
    dados.forEach(d => {
      const dateKey = d.data_login.toISOString();
      if (!(dateKey in resultDict)) {
        resultDict[dateKey] = {
          data: d.data_login.toISOString().split('T')[0],
          outros: 0,
        };
        aplicacoesFixed.forEach(a => {
          resultDict[dateKey][a] = 0;
        });
      }

      if (aplicacoesFixed.indexOf(d.aplicacao) !== -1) {
        resultDict[dateKey][d.aplicacao] = +d.logins;
      } else {
        resultDict[dateKey].outros += +d.logins;
      }
    });

    return Object.values(resultDict);
  },

  getLoginsUsuarios: async (total = 14, max = 10): Promise<LoginUsuario[]> => {
    const usuarios = await db.conn.any<UsuarioLoginCount>(
      SQL.GET_USUARIOS_WITH_LOGINS,
      { total: total - 1, max: max - 1 },
    );

    const dados = await db.conn.any<{
      data_login: Date;
      usuario: string;
      logins: string;
    }>(SQL.GET_LOGINS_USUARIOS_BY_DAY, { total: total - 1 });

    const usuariosFixed: string[] = [];
    usuarios.forEach(u => usuariosFixed.push(u.usuario));

    const resultDict: { [key: string]: LoginUsuario } = {};
    dados.forEach(d => {
      const dateKey = d.data_login.toISOString();
      if (!(dateKey in resultDict)) {
        resultDict[dateKey] = {
          data: d.data_login.toISOString().split('T')[0],
          outros: 0,
        };
        usuariosFixed.forEach(u => {
          resultDict[dateKey][u] = 0;
        });
      }

      if (usuariosFixed.indexOf(d.usuario) !== -1) {
        resultDict[dateKey][d.usuario] = +d.logins;
      } else {
        resultDict[dateKey].outros += +d.logins;
      }
    });

    return Object.values(resultDict);
  },
};

export default controller;
