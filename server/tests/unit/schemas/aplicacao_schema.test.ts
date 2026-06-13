import { describe, it, expect } from 'vitest';
import schemas from '../../../src/aplicacoes/aplicacao_schema.js';
import loginSchemas from '../../../src/login/login_schema.js';

describe('aplicacao_schema.idParams', () => {
  it('aceita id numérico positivo (como string de path param)', () => {
    expect(schemas.idParams.safeParse({ id: '5' }).success).toBe(true);
  });

  it('rejeita zero, negativo e não-numérico', () => {
    expect(schemas.idParams.safeParse({ id: '0' }).success).toBe(false);
    expect(schemas.idParams.safeParse({ id: '-3' }).success).toBe(false);
    expect(schemas.idParams.safeParse({ id: 'abc' }).success).toBe(false);
  });
});

describe('aplicacao_schema.aplicacao', () => {
  it('aceita payload válido', () => {
    expect(
      schemas.aplicacao.safeParse({
        nome: 'App',
        nome_abrev: 'app',
        ativa: true,
      }).success,
    ).toBe(true);
  });

  it('exige ativa booleana e nomes não-vazios', () => {
    expect(
      schemas.aplicacao.safeParse({ nome: 'App', nome_abrev: 'app' }).success,
    ).toBe(false); // ativa ausente
    expect(
      schemas.aplicacao.safeParse({ nome: '', nome_abrev: 'app', ativa: true })
        .success,
    ).toBe(false);
  });
});

describe('login_schema.login', () => {
  it('aceita usuário, senha e aplicação', () => {
    expect(
      loginSchemas.login.safeParse({
        usuario: 'u',
        senha: 'p',
        aplicacao: 'auth_web',
      }).success,
    ).toBe(true);
  });

  it('rejeita quando falta qualquer campo', () => {
    expect(
      loginSchemas.login.safeParse({ usuario: 'u', senha: 'p' }).success,
    ).toBe(false);
    expect(
      loginSchemas.login.safeParse({ senha: 'p', aplicacao: 'a' }).success,
    ).toBe(false);
  });
});
