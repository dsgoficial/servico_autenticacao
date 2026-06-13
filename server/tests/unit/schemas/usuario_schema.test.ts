import { describe, it, expect } from 'vitest';
import schemas from '../../../src/usuarios/usuario_schema.js';

const UUID = '11111111-1111-1111-1111-111111111111';
const UUID2 = '22222222-2222-2222-2222-222222222222';

const usuarioValido = {
  usuario: 'jsilva',
  senha: 'segredo',
  nome: 'João da Silva',
  nome_guerra: 'Silva',
  tipo_posto_grad_id: 3,
  tipo_turno_id: 1,
};

describe('usuario_schema.criacaoUsuario', () => {
  it('aceita um payload completo e válido', () => {
    expect(schemas.criacaoUsuario.safeParse(usuarioValido).success).toBe(true);
  });

  it('rejeita campos de texto obrigatórios vazios', () => {
    expect(
      schemas.criacaoUsuario.safeParse({ ...usuarioValido, usuario: '' })
        .success,
    ).toBe(false);
    expect(
      schemas.criacaoUsuario.safeParse({ ...usuarioValido, nome: '' }).success,
    ).toBe(false);
  });

  it('rejeita ids de posto/turno não positivos ou não inteiros', () => {
    expect(
      schemas.criacaoUsuario.safeParse({
        ...usuarioValido,
        tipo_posto_grad_id: 0,
      }).success,
    ).toBe(false);
    expect(
      schemas.criacaoUsuario.safeParse({
        ...usuarioValido,
        tipo_posto_grad_id: -1,
      }).success,
    ).toBe(false);
    expect(
      schemas.criacaoUsuario.safeParse({
        ...usuarioValido,
        tipo_turno_id: 1.5,
      }).success,
    ).toBe(false);
  });
});

describe('usuario_schema.atualizacaoUsuarioCompleto', () => {
  const valido = {
    uuid: UUID,
    usuario: 'jsilva',
    nome: 'João',
    nome_guerra: 'Silva',
    tipo_posto_grad_id: 3,
    tipo_turno_id: 1,
    administrador: true,
    ativo: false,
  };

  it('aceita administrador/ativo como booleanos independentes', () => {
    expect(schemas.atualizacaoUsuarioCompleto.safeParse(valido).success).toBe(
      true,
    );
  });

  it('rejeita uuid inválido', () => {
    expect(
      schemas.atualizacaoUsuarioCompleto.safeParse({
        ...valido,
        uuid: 'nao-eh-uuid',
      }).success,
    ).toBe(false);
  });

  it('rejeita quando administrador/ativo não são booleanos', () => {
    expect(
      schemas.atualizacaoUsuarioCompleto.safeParse({
        ...valido,
        administrador: 'true',
      }).success,
    ).toBe(false);
  });
});

describe('usuario_schema.listaUsuarios', () => {
  it('aceita lista de UUIDs válidos e distintos', () => {
    expect(
      schemas.listaUsuarios.safeParse({ usuarios_uuids: [UUID, UUID2] }).success,
    ).toBe(true);
  });

  it('rejeita lista vazia', () => {
    expect(
      schemas.listaUsuarios.safeParse({ usuarios_uuids: [] }).success,
    ).toBe(false);
  });

  it('rejeita UUIDs duplicados (refine)', () => {
    expect(
      schemas.listaUsuarios.safeParse({ usuarios_uuids: [UUID, UUID] }).success,
    ).toBe(false);
  });

  it('rejeita UUID malformado na lista', () => {
    expect(
      schemas.listaUsuarios.safeParse({ usuarios_uuids: [UUID, 'x'] }).success,
    ).toBe(false);
  });
});

describe('usuario_schema.ativoParams / uuidParams', () => {
  it('ativoParams só aceita as strings "true"/"false"', () => {
    expect(schemas.ativoParams.safeParse({ ativo: 'true' }).success).toBe(true);
    expect(schemas.ativoParams.safeParse({ ativo: 'false' }).success).toBe(true);
    expect(schemas.ativoParams.safeParse({ ativo: 'maybe' }).success).toBe(
      false,
    );
  });

  it('uuidParams exige um UUID válido', () => {
    expect(
      schemas.uuidParams.safeParse({ usuario_uuid: UUID }).success,
    ).toBe(true);
    expect(
      schemas.uuidParams.safeParse({ usuario_uuid: '123' }).success,
    ).toBe(false);
  });
});
