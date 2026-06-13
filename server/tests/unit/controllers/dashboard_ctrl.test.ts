import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../src/database/index.js', () => ({
  db: {
    conn: { any: vi.fn(), one: vi.fn() },
    pgp: {},
  },
  databaseVersion: { load: vi.fn() },
}));

import controller from '../../../src/dashboard/dashboard_ctrl.js';
import { db } from '../../../src/database/index.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const conn = (db as any).conn;

beforeEach(() => {
  vi.resetAllMocks();
});

describe('getLoginsDia / getLoginsMes — normalização de data e número', () => {
  // Regressão (bug #11): data_login é tipado como string mas chega como Date;
  // o controller normaliza. Regressão (bug #10): a data deve sair no fuso
  // local (YYYY-MM-DD), sem o deslocamento de -1 dia do toISOString() UTC.
  it('REGRESSÃO: converte Date -> "YYYY-MM-DD" local e logins -> number', async () => {
    conn.any.mockResolvedValueOnce([
      { data_login: new Date(2024, 0, 15), logins: '5' },
      { data_login: new Date(2024, 11, 31), logins: '0' },
    ]);

    const result = await controller.getLoginsDia(14);

    expect(result).toEqual([
      { data_login: '2024-01-15', logins: 5 },
      { data_login: '2024-12-31', logins: 0 },
    ]);
    // garante que os tipos batem com o contrato declarado
    expect(typeof result[0].data_login).toBe('string');
    expect(typeof result[0].logins).toBe('number');
  });

  // Regressão (bug #4 original do dashboard): off-by-one no intervalo.
  it('aplica off-by-one: passa total-1 para a query', async () => {
    conn.any.mockResolvedValueOnce([]);
    await controller.getLoginsDia(14);
    expect(conn.any).toHaveBeenCalledWith(expect.anything(), { total: 13 });
  });

  it('getLoginsMes também normaliza e usa total-1', async () => {
    conn.any.mockResolvedValueOnce([
      { data_login: new Date(2024, 5, 1), logins: '7' },
    ]);
    const result = await controller.getLoginsMes(12);
    expect(result).toEqual([{ data_login: '2024-06-01', logins: 7 }]);
    expect(conn.any).toHaveBeenCalledWith(expect.anything(), { total: 11 });
  });
});

describe('getLoginsAplicacoes — agregação por dia', () => {
  it('agrupa por data local, soma "outros" e passa total-1/max', async () => {
    // 1ª chamada: lista das aplicações no topo
    conn.any.mockResolvedValueOnce([{ aplicacao: 'auth_web', logins: 5 }]);
    // 2ª chamada: logins por dia por aplicação
    conn.any.mockResolvedValueOnce([
      { data_login: new Date(2024, 0, 15), aplicacao: 'auth_web', logins: '3' },
      { data_login: new Date(2024, 0, 15), aplicacao: 'outra_app', logins: '2' },
      { data_login: new Date(2024, 0, 16), aplicacao: 'auth_web', logins: '0' },
    ]);

    const result = await controller.getLoginsAplicacoes(14, 10);

    expect(result).toEqual([
      { data: '2024-01-15', outros: 2, auth_web: 3 },
      { data: '2024-01-16', outros: 0, auth_web: 0 },
    ]);
    // off-by-one + repasse do max
    expect(conn.any).toHaveBeenNthCalledWith(1, expect.anything(), {
      total: 13,
      max: 10,
    });
    expect(conn.any).toHaveBeenNthCalledWith(2, expect.anything(), {
      total: 13,
    });
  });
});

describe('getLoginsUsuarios — agregação por dia', () => {
  it('agrupa por data local e classifica usuários fora do topo em "outros"', async () => {
    conn.any.mockResolvedValueOnce([{ usuario: 'Cel Silva (jsilva)', logins: 4 }]);
    conn.any.mockResolvedValueOnce([
      {
        data_login: new Date(2024, 2, 10),
        usuario: 'Cel Silva (jsilva)',
        logins: '4',
      },
      {
        data_login: new Date(2024, 2, 10),
        usuario: 'Sgt Souza (msouza)',
        logins: '1',
      },
    ]);

    const result = await controller.getLoginsUsuarios(14, 10);

    expect(result).toEqual([
      { data: '2024-03-10', outros: 1, 'Cel Silva (jsilva)': 4 },
    ]);
  });
});
