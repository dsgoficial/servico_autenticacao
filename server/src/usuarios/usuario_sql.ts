// Path: usuarios\usuario_sql.ts
export const SQL = {
  GET_NON_ADMIN_USERS: `
      SELECT id, login FROM dgeo.usuario WHERE uuid IN ($<usuariosUUID:csv>) AND administrador IS FALSE
    `,

  UPDATE_USER_PASSWORD: `
      UPDATE dgeo.usuario SET senha = $<senha> WHERE id = $<id>
    `,

  UPDATE_USER_AUTHORIZATION: `
      UPDATE dgeo.usuario
      SET ativo = $<ativo>
      WHERE uuid IN ($<usuariosUUID:csv>) AND administrador IS FALSE
    `,

  GET_TIPO_POSTO_GRAD: `
      SELECT code, nome, nome_abrev
      FROM dominio.tipo_posto_grad
    `,

  GET_TIPO_TURNO: `
      SELECT code, nome
      FROM dominio.tipo_turno
    `,

  GET_USUARIOS_COMPLETO: `
      SELECT u.uuid, u.login, u.nome, u.nome_guerra, u.tipo_posto_grad_id, tpg.nome_abrev AS tipo_posto_grad,
      u.tipo_turno_id, tt.nome AS tipo_turno,
      u.ativo, u.administrador
      FROM dgeo.usuario AS u
      INNER JOIN dominio.tipo_posto_grad AS tpg ON tpg.code = u.tipo_posto_grad_id
      INNER JOIN dominio.tipo_turno AS tt ON tt.code = u.tipo_turno_id
    `,

  CHECK_USER_EXISTS: `
      SELECT id FROM dgeo.usuario WHERE login = $<login>
    `,

  CREATE_USER_WITH_UUID: `
      INSERT INTO dgeo.usuario(login, senha, nome, nome_guerra, administrador, ativo, tipo_posto_grad_id, tipo_turno_id, uuid)
      VALUES ($<login>, $<hash>, $<nome>, $<nomeGuerra>, $<administrador>, $<ativo>, $<tipoPostoGradId>, $<tipoTurnoId>, $<uuid>)
    `,

  CREATE_USER: `
      INSERT INTO dgeo.usuario(login, senha, nome, nome_guerra, administrador, ativo, tipo_posto_grad_id, tipo_turno_id)
      VALUES ($<login>, $<hash>, $<nome>, $<nomeGuerra>, $<administrador>, $<ativo>, $<tipoPostoGradId>, $<tipoTurnoId>)
    `,

  CHECK_OTHER_ADMIN_EXISTS: `
      SELECT id FROM dgeo.usuario WHERE login != $<login> AND administrador IS TRUE AND ativo IS TRUE LIMIT 1
    `,

  UPDATE_USER_COMPLETE: `
      UPDATE dgeo.usuario
      SET login = $<login>, nome = $<nome>, nome_guerra = $<nomeGuerra>, tipo_posto_grad_id = $<tipoPostoGradId>,
      tipo_turno_id = $<tipoTurnoId>, ativo = $<ativo>, administrador = $<administrador>, uuid = $<novoUuid>
      WHERE uuid = $<uuid>
    `,

  UPDATE_USER_PASSWORD_BY_UUID: `
      UPDATE dgeo.usuario
      SET senha = $<hash>
      WHERE uuid = $<uuid> AND ativo IS TRUE
    `,

  UPDATE_USER: `
      UPDATE dgeo.usuario
      SET nome = $<nome>, nome_guerra = $<nomeGuerra>, tipo_posto_grad_id = $<tipoPostoGradId>,
      tipo_turno_id = $<tipoTurnoId>
      WHERE uuid = $<uuid>
    `,

  CHECK_USER_IS_ADMIN: `
      SELECT uuid FROM dgeo.usuario 
      WHERE uuid = $<uuid> AND administrador IS TRUE
    `,

  NULLIFY_USER_LOGIN_REFERENCES: `
      UPDATE dgeo.login
      SET usuario_id = NULL
      WHERE usuario_id IN 
      (SELECT id FROM dgeo.usuario WHERE uuid = $<uuid> AND administrador IS FALSE)
    `,

  DELETE_USER: `
      DELETE FROM dgeo.usuario WHERE uuid = $<uuid> AND administrador IS FALSE
    `,

  GET_USER_BY_UUID: `
      SELECT u.uuid, u.login, u.nome, u.nome_guerra, u.tipo_posto_grad_id, tpg.nome_abrev AS tipo_posto_grad,
      u.tipo_turno_id, tt.nome AS tipo_turno
      FROM dgeo.usuario AS u
      INNER JOIN dominio.tipo_posto_grad AS tpg ON tpg.code = u.tipo_posto_grad_id
      INNER JOIN dominio.tipo_turno AS tt ON tt.code = u.tipo_turno_id
      WHERE u.ativo IS TRUE AND u.uuid = $<uuid>
    `,

  GET_USUARIOS: `
      SELECT u.uuid, u.login, u.nome, u.nome_guerra, u.tipo_posto_grad_id, tpg.nome_abrev AS tipo_posto_grad,
      u.tipo_turno_id, tt.nome AS tipo_turno
      FROM dgeo.usuario AS u
      INNER JOIN dominio.tipo_posto_grad AS tpg ON tpg.code = u.tipo_posto_grad_id
      INNER JOIN dominio.tipo_turno AS tt ON tt.code = u.tipo_turno_id
      WHERE u.ativo IS TRUE
    `,

  CREATE_REGULAR_USER: `
      INSERT INTO dgeo.usuario(login, senha, nome, nome_guerra, administrador, ativo, tipo_posto_grad_id, tipo_turno_id)
      VALUES ($<login>, $<hash>, $<nome>, $<nomeGuerra>, FALSE, FALSE, $<tipoPostoGradId>, $<tipoTurnoId>)
    `,
};
