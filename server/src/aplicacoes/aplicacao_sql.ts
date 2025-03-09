// Path: aplicacoes\aplicacao_sql.ts
export const SQL = {
  GET_APLICACAO: `
      SELECT id, nome, nome_abrev, ativa
      FROM dgeo.aplicacao
    `,

  CHECK_DEFAULT_APLICACAO: `
      SELECT id FROM dgeo.aplicacao 
      WHERE id = $<id> AND nome_abrev IN ('auth_web', 'sap_fp', 'sap_fg', 'sap', 'fme_web', 'sapdashboard_web')
    `,

  UPDATE_LOGIN_NULL_APLICACAO: `
      UPDATE dgeo.login
      SET aplicacao_id = NULL
      WHERE aplicacao_id = $<id>
    `,

  DELETE_APLICACAO: `
      DELETE FROM dgeo.aplicacao WHERE id = $<id>
    `,

  CHECK_APLICACAO_EXISTS: `
      SELECT id FROM dgeo.aplicacao WHERE nome = $<nome> OR nome_abrev = $<nomeAbrev>
    `,

  INSERT_APLICACAO: `
      INSERT INTO dgeo.aplicacao(nome, nome_abrev, ativa)
      VALUES ($<nome>, $<nomeAbrev>, $<ativa>)
    `,

  GET_APLICACAO_BY_ID: `
      SELECT id FROM dgeo.aplicacao WHERE id = $<id>
    `,

  CHECK_APLICACAO_COLLISION: `
      SELECT id FROM dgeo.aplicacao WHERE id != $<id> AND (nome = $<nome> OR nome_abrev = $<nomeAbrev>) LIMIT 1
    `,

  CHECK_DEFAULT_APLICACAO_FOR_UPDATE: `
      SELECT id FROM dgeo.aplicacao 
      WHERE id = $<id> AND nome_abrev IN ('auth_web', 'sap_fp', 'sap_fg', 'sap', 'fme_web', 'sapdashboard_web')
      AND (nome != $<nome> OR nome_abrev != $<nomeAbrev>)
    `,

  CHECK_AUTH_APLICACAO: `
      SELECT id FROM dgeo.aplicacao 
      WHERE id = $<id> AND nome_abrev = 'auth_web'
    `,

  UPDATE_APLICACAO: `
      UPDATE dgeo.aplicacao
      SET nome = $<nome>, nome_abrev = $<nomeAbrev>, ativa = $<ativa>
      WHERE id = $<id>
    `,
};
