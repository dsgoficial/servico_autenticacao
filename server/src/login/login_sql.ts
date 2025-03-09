// Path: login\login_sql.ts
export const SQL = {
  RECORD_LOGIN: `
      INSERT INTO dgeo.login(usuario_id, data_login, aplicacao_id) VALUES($<usuarioId>, now(), $<aplicacaoId>)
    `,

  GET_APLICACAO: `
      SELECT id FROM dgeo.aplicacao WHERE nome_abrev = $<aplicacao> and ativa IS TRUE
    `,

  GET_USER: `
      SELECT id, uuid, administrador, senha FROM dgeo.usuario WHERE login = $<usuario> and ativo IS TRUE
    `,

  GET_USER_BY_UUID: `
      SELECT id, uuid, administrador, senha FROM dgeo.usuario WHERE uuid = $<uuid> and ativo IS TRUE
    `,

  CHECK_ADMIN: `
      SELECT administrador FROM dgeo.usuario WHERE uuid = $<usuarioUuid> and ativo IS TRUE
    `,

  CHECK_ACTIVE: `
      SELECT ativo FROM dgeo.usuario WHERE uuid = $<usuarioUuid>
    `,
};
