import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../src/database/index.js', () => ({
  db: {
    conn: {
      tx: vi.fn(),
      none: vi.fn(),
      oneOrNone: vi.fn(),
      result: vi.fn(),
    },
    pgp: {},
  },
  databaseVersion: { load: vi.fn() },
}));

import controller from '../../../src/aplicacoes/aplicacao_ctrl.js';
import { db } from '../../../src/database/index.js';
import { HttpCode } from '../../../src/utils/http_code.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const conn = (db as any).conn;

beforeEach(() => {
  vi.resetAllMocks();
  conn.tx.mockImplementation((cb: (t: unknown) => unknown) => cb(conn));
});

describe('criaAplicacao', () => {
  it('rejeita (400) quando nome ou nome_abrev já existem; não insere', async () => {
    conn.oneOrNone.mockResolvedValueOnce({ id: 1 });
    await expect(
      controller.criaAplicacao('App', 'app', true),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
    expect(conn.none).not.toHaveBeenCalled();
  });

  it('insere normalizando ativa para booleano', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null);
    conn.none.mockResolvedValueOnce(undefined);
    await controller.criaAplicacao('App', 'app', true);
    expect(conn.none).toHaveBeenCalledWith(expect.anything(), {
      nome: 'App',
      nomeAbrev: 'app',
      ativa: true,
    });
  });
});

describe('updateAplicacao — ordem das validações', () => {
  it('lança 404 quando o id não existe', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null); // GET_APLICACAO_BY_ID -> não existe
    await expect(
      controller.updateAplicacao(1, 'App', 'app', true),
    ).rejects.toMatchObject({ statusCode: HttpCode.NotFound });
    expect(conn.none).not.toHaveBeenCalled();
  });

  it('lança 400 em colisão de nome/nome_abrev', async () => {
    conn.oneOrNone.mockResolvedValueOnce({ id: 1 }); // existe
    conn.oneOrNone.mockResolvedValueOnce({ id: 2 }); // colisão
    await expect(
      controller.updateAplicacao(1, 'App', 'app', true),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
  });

  it('impede renomear aplicação padrão', async () => {
    conn.oneOrNone.mockResolvedValueOnce({ id: 1 }); // existe
    conn.oneOrNone.mockResolvedValueOnce(null); // sem colisão
    conn.oneOrNone.mockResolvedValueOnce({ id: 1 }); // é padrão
    await expect(
      controller.updateAplicacao(1, 'App', 'app', true),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
  });

  it('impede desativar o cliente web de autenticação', async () => {
    conn.oneOrNone.mockResolvedValueOnce({ id: 1 }); // existe
    conn.oneOrNone.mockResolvedValueOnce(null); // sem colisão
    conn.oneOrNone.mockResolvedValueOnce(null); // não é padrão
    conn.oneOrNone.mockResolvedValueOnce({ id: 1 }); // é auth_web
    await expect(
      controller.updateAplicacao(1, 'Auth', 'auth_web', false),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
  });

  it('atualiza quando todas as validações passam', async () => {
    conn.oneOrNone
      .mockResolvedValueOnce({ id: 1 }) // existe
      .mockResolvedValueOnce(null) // sem colisão
      .mockResolvedValueOnce(null) // não é padrão
      .mockResolvedValueOnce(null); // não é auth_web
    conn.none.mockResolvedValueOnce(undefined);
    await controller.updateAplicacao(1, 'App', 'app', true);
    expect(conn.none).toHaveBeenCalledOnce();
  });
});

describe('deletaAplicacao', () => {
  it('impede deletar aplicação padrão', async () => {
    conn.oneOrNone.mockResolvedValueOnce({ id: 1 }); // é padrão
    await expect(controller.deletaAplicacao(1)).rejects.toMatchObject({
      statusCode: HttpCode.BadRequest,
    });
    expect(conn.result).not.toHaveBeenCalled();
  });

  it('lança 404 quando o DELETE não afeta linha', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null); // não é padrão
    conn.none.mockResolvedValueOnce(undefined); // desvincula logins
    conn.result.mockResolvedValueOnce({ rowCount: 0 });
    await expect(controller.deletaAplicacao(1)).rejects.toMatchObject({
      statusCode: HttpCode.NotFound,
    });
  });

  it('deleta e desvincula logins quando válido', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null);
    conn.none.mockResolvedValueOnce(undefined);
    conn.result.mockResolvedValueOnce({ rowCount: 1 });
    await controller.deletaAplicacao(1);
    expect(conn.none).toHaveBeenCalledOnce();
    expect(conn.result).toHaveBeenCalledOnce();
  });
});
