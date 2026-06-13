import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

vi.mock('../../../src/database/index.js', () => ({
  db: {
    conn: { tx: vi.fn(), oneOrNone: vi.fn(), any: vi.fn() },
    pgp: {},
  },
  databaseVersion: { load: vi.fn() },
}));

import loginController from '../../../src/login/login_ctrl.js';
import { db } from '../../../src/database/index.js';
import config from '../../../src/config.js';
import { HttpCode } from '../../../src/utils/http_code.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const conn = (db as any).conn;

const UUID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const senhaHash = bcrypt.hashSync('segredo', 8);

beforeEach(() => {
  vi.resetAllMocks();
  conn.tx.mockImplementation((cb: (t: unknown) => unknown) => cb(conn));
});

describe('login_ctrl.login', () => {
  it('rejeita (400) quando a aplicação não pode usar o serviço', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null); // GET_APLICACAO -> null
    await expect(
      loginController.login('jsilva', 'segredo', 'app_x'),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
  });

  it('rejeita (400) quando o usuário não está autorizado', async () => {
    conn.oneOrNone
      .mockResolvedValueOnce({ id: 7 }) // aplicação ok
      .mockResolvedValueOnce(null); // usuário não encontrado
    await expect(
      loginController.login('jsilva', 'segredo', 'auth_web'),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
  });

  it('rejeita (400) quando a senha está incorreta', async () => {
    conn.oneOrNone
      .mockResolvedValueOnce({ id: 7 })
      .mockResolvedValueOnce({
        id: 5,
        uuid: UUID,
        administrador: false,
        senha: senhaHash,
      });
    await expect(
      loginController.login('jsilva', 'senha-errada', 'auth_web'),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
    expect(conn.any).not.toHaveBeenCalled(); // não grava login
  });

  it('autentica, grava o login e devolve um JWT válido', async () => {
    conn.oneOrNone
      .mockResolvedValueOnce({ id: 7 }) // aplicação
      .mockResolvedValueOnce({
        id: 5,
        uuid: UUID,
        administrador: true,
        senha: senhaHash,
      });
    conn.any.mockResolvedValueOnce([]); // RECORD_LOGIN

    const result = await loginController.login('jsilva', 'segredo', 'auth_web');

    expect(result).toMatchObject({ administrador: true, uuid: UUID });
    expect(conn.any).toHaveBeenCalledOnce(); // gravou o login

    const decoded = jwt.verify(result.token, config.JWT_SECRET) as {
      id: number;
      uuid: string;
      administrador: boolean;
    };
    expect(decoded).toMatchObject({ id: 5, uuid: UUID, administrador: true });
  });
});

describe('login_ctrl.verifyPassword', () => {
  it('rejeita (400) quando o usuário não existe', async () => {
    conn.oneOrNone.mockResolvedValueOnce(null);
    await expect(
      loginController.verifyPassword(UUID, 'segredo'),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
  });

  it('rejeita (400) quando a senha atual não confere', async () => {
    conn.oneOrNone.mockResolvedValueOnce({ senha: senhaHash });
    await expect(
      loginController.verifyPassword(UUID, 'outra'),
    ).rejects.toMatchObject({ statusCode: HttpCode.BadRequest });
  });

  it('resolve quando a senha confere', async () => {
    conn.oneOrNone.mockResolvedValueOnce({ senha: senhaHash });
    await expect(
      loginController.verifyPassword(UUID, 'segredo'),
    ).resolves.toBeUndefined();
  });
});
