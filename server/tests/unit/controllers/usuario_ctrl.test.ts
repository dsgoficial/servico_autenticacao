import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcryptjs';

// Mock da camada de banco: `conn` é um objeto de vi.fns; `tx` repassa a própria
// `conn` como transação `t`, então `t.oneOrNone`/`t.result`/`t.none` usam os
// mesmos mocks. `pgp` é o pg-promise real (resetaSenhaUsuarios usa helpers).
vi.mock('../../../src/database/index.js', async () => {
  const pgPromise = (await import('pg-promise')).default;
  return {
    db: {
      conn: {
        tx: vi.fn(),
        none: vi.fn(),
        one: vi.fn(),
        oneOrNone: vi.fn(),
        any: vi.fn(),
        result: vi.fn(),
      },
      pgp: pgPromise(),
    },
    databaseVersion: { load: vi.fn() },
  };
});

// Evita carregar a cadeia real de login (usada só por updateSenha, não testada
// aqui) ao importar o controller.
vi.mock('../../../src/login/index.js', () => ({
  loginController: { verifyPassword: vi.fn() },
}));

import controller from '../../../src/usuarios/usuario_ctrl.js';
import { db } from '../../../src/database/index.js';
import { HttpCode } from '../../../src/utils/http_code.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const conn = (db as any).conn;

const UUID = '11111111-1111-1111-1111-111111111111';
const UUID2 = '22222222-2222-2222-2222-222222222222';

beforeEach(() => {
  vi.resetAllMocks();
  conn.tx.mockImplementation((cb: (t: unknown) => unknown) => cb(conn));
});

describe('updateUsuarioCompleto — guarda do último administrador', () => {
  // (uuid, login, nome, nomeGuerra, tipoPostoGradId, tipoTurnoId, ...)
  const base = [UUID, 'login', 'Nome', 'NG', 1, 1] as const;

  it('bloqueia rebaixar (administrador=false) o último admin', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null); // nenhum outro admin ativo
    await expect(
      controller.updateUsuarioCompleto(...base, true, false, UUID),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
    expect(conn.result).not.toHaveBeenCalled();
  });

  // Regressão (bug #1): a guarda antes só rodava em `if (!administrador)`.
  // Desativar (ativo=false) um admin que continua administrador=true tirava o
  // último admin do ar sem disparar a checagem -> lockout.
  it('REGRESSÃO: bloqueia desativar (ativo=false) o último admin mesmo com administrador=true', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null);
    await expect(
      controller.updateUsuarioCompleto(...base, false, true, UUID),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
    // a checagem usa o uuid do path, não o login do body
    expect(conn.oneOrNone).toHaveBeenCalledWith(expect.anything(), {
      uuid: UUID,
    });
    expect(conn.result).not.toHaveBeenCalled();
  });

  it('permite desativar admin quando existe outro admin ativo', async () => {
    conn.oneOrNone.mockResolvedValueOnce({ id: 99 });
    conn.result.mockResolvedValueOnce({ rowCount: 1 });
    await expect(
      controller.updateUsuarioCompleto(...base, false, true, UUID),
    ).resolves.toBeUndefined();
    expect(conn.result).toHaveBeenCalledOnce();
  });

  it('não consulta a guarda quando mantém admin ativo', async () => {
    conn.result.mockResolvedValueOnce({ rowCount: 1 });
    await controller.updateUsuarioCompleto(...base, true, true, UUID);
    expect(conn.oneOrNone).not.toHaveBeenCalled();
  });

  it('lança 404 quando o UPDATE não afeta linha alguma', async () => {
    conn.oneOrNone.mockResolvedValueOnce({ id: 99 });
    conn.result.mockResolvedValueOnce({ rowCount: 0 });
    await expect(
      controller.updateUsuarioCompleto(...base, false, true, UUID),
    ).rejects.toMatchObject({ statusCode: HttpCode.NotFound });
  });
});

describe('criaUsuario — unicidade de login', () => {
  const args = ['jsilva', 'segredo', 'João', 'Silva', 3, 1] as const;

  it('rejeita (400) antes de inserir se o login já existe (checagem prévia)', async () => {
    conn.oneOrNone.mockResolvedValueOnce({ id: 1 });
    await expect(controller.criaUsuario(...args)).rejects.toMatchObject({
      statusCode: HttpCode.BadRequest,
    });
    expect(conn.none).not.toHaveBeenCalled();
  });

  // Regressão (bug #5): corrida check-then-insert. A violação 23505 do Postgres
  // deve virar 400 amigável, não 500 com erro cru.
  it('REGRESSÃO: traduz violação de unicidade (23505) em 400', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null);
    conn.none.mockRejectedValueOnce({ code: '23505' });
    await expect(controller.criaUsuario(...args)).rejects.toMatchObject({
      statusCode: HttpCode.BadRequest,
      message: expect.stringMatching(/já existe/i),
    });
  });

  it('repassa erros de banco que não sejam de unicidade', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null);
    conn.none.mockRejectedValueOnce(new Error('falha de conexão'));
    await expect(controller.criaUsuario(...args)).rejects.toThrow(
      /falha de conexão/,
    );
  });

  it('insere com a senha em hash (nunca em texto puro)', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null);
    conn.none.mockResolvedValueOnce(undefined);
    await controller.criaUsuario(...args);
    expect(conn.none).toHaveBeenCalledOnce();
    const params = conn.none.mock.calls[0][1] as { hash: string };
    expect(params.hash).not.toBe('segredo');
    expect(bcrypt.compareSync('segredo', params.hash)).toBe(true);
  });
});

describe('criaUsuarioCompleto — unicidade de login', () => {
  const args = ['jsilva', 'segredo', 'João', 'Silva', 3, 1, true, false] as const;

  it('REGRESSÃO: traduz 23505 em 400 também no fluxo completo', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null);
    conn.none.mockRejectedValueOnce({ code: '23505' });
    await expect(
      controller.criaUsuarioCompleto(...args),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
  });
});

describe('modificaAutorizacao — sem no-op silencioso', () => {
  // Regressão (bug #8): antes, UUIDs inexistentes/admin eram filtrados em
  // silêncio e a rota respondia sucesso. Agora reporta os não processados.
  it('REGRESSÃO: lança 400 listando UUIDs não processados', async () => {
    conn.any.mockResolvedValueOnce([{ id: 1, login: 'a', uuid: UUID }]);
    await expect(
      controller.modificaAutorizacao([UUID, UUID2], true),
    ).rejects.toMatchObject({
      statusCode: HttpCode.BadRequest,
      message: expect.stringContaining(UUID2),
    });
    expect(conn.none).not.toHaveBeenCalled();
  });

  it('atualiza quando todos os UUIDs são válidos', async () => {
    conn.any.mockResolvedValueOnce([{ uuid: UUID }, { uuid: UUID2 }]);
    conn.none.mockResolvedValueOnce(undefined);
    await controller.modificaAutorizacao([UUID, UUID2], true);
    expect(conn.none).toHaveBeenCalledWith(expect.anything(), {
      usuariosUUID: [UUID, UUID2],
      ativo: true,
    });
  });
});

describe('getUsuario — código de status correto', () => {
  // Regressão (bug #9): usuário inexistente devolvia 400; deve ser 404.
  it('REGRESSÃO: lança 404 (não 400) quando o usuário não existe', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null);
    await expect(controller.getUsuario(UUID)).rejects.toMatchObject({
      statusCode: HttpCode.NotFound,
    });
    await expect(controller.getUsuario(UUID)).rejects.not.toMatchObject({
      statusCode: HttpCode.BadRequest,
    });
  });

  it('retorna o usuário quando encontrado', async () => {
    const user = { uuid: UUID, login: 'jsilva' };
    conn.oneOrNone.mockResolvedValue(user);
    await expect(controller.getUsuario(UUID)).resolves.toEqual(user);
  });
});

describe('resetaSenhaUsuarios', () => {
  it('lança 404 quando nenhum usuário (não-admin) é encontrado', async () => {
    conn.any.mockResolvedValueOnce([]);
    await expect(
      controller.resetaSenhaUsuarios([UUID]),
    ).rejects.toMatchObject({ statusCode: HttpCode.NotFound });
  });

  it('lança 400 listando UUIDs solicitados não processados', async () => {
    conn.any.mockResolvedValueOnce([{ id: 1, login: 'a', uuid: UUID }]);
    await expect(
      controller.resetaSenhaUsuarios([UUID, UUID2]),
    ).rejects.toMatchObject({
      statusCode: HttpCode.BadRequest,
      message: expect.stringContaining(UUID2),
    });
    expect(conn.none).not.toHaveBeenCalled();
  });

  it('aplica o reset (atômico) quando todos os UUIDs são válidos', async () => {
    conn.any.mockResolvedValueOnce([{ id: 1, login: 'aaaaa', uuid: UUID }]);
    conn.none.mockResolvedValueOnce(undefined);
    await controller.resetaSenhaUsuarios([UUID]);
    expect(conn.none).toHaveBeenCalledOnce();
  });
});
