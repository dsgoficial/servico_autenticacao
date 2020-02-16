'use strict'

const { db } = require('../database')

const { AppError, httpCode } = require('../utils')

const { loginController } = require('../login')

const bcrypt = require('bcryptjs')

const controller = {}

controller.resetaSenhaUsuarios = async usuariosUUID => {
  return db.conn.tx(async t => {
    const logins = await t.any(
      'SELECT id, login FROM dgeo.usuario WHERE uuid IN ($<usuariosUUID:csv>) AND administrador IS FALSE',
      { usuariosUUID }
    )
    if (!logins) {
      throw new AppError('Usuários não encontrados', httpCode.NotFound)
    }

    const table = new db.pgp.helpers.TableName({
      table: 'usuario',
      schema: 'dgeo'
    })

    const cs = new db.pgp.helpers.ColumnSet(['?id', 'senha'], { table })

    const values = []

    for (const { id, login } of logins) {
      const senha = await bcrypt.hash(login, 10)
      values.push({
        id,
        senha
      })
    }
    const query =
      db.pgp.helpers.update(values, cs, null, {
        tableAlias: 'X',
        valueAlias: 'Y'
      }) + 'WHERE Y.id = X.id'

    await t.none(query)
  })
}

controller.modificaAutorizacao = async (usuariosUUID, ativo) => {
  return db.conn.none(
    `UPDATE dgeo.usuario
    SET ativo = $<ativo>
    WHERE uuid IN ($<usuariosUUID:csv>) AND administrador IS FALSE`,
    { usuariosUUID, ativo }
  )
}

controller.getTipoPostoGrad = async () => {
  return db.conn.any(
    `SELECT code, nome, nome_abrev
    FROM dominio.tipo_posto_grad`
  )
}

controller.getTipoTurno = async () => {
  return db.conn.any(
    `SELECT code, nome
    FROM dominio.tipo_turno`
  )
}

controller.getUsuariosCompleto = async () => {
  return db.conn.any(
    `SELECT u.uuid, u.login, u.nome, u.nome_guerra, u.tipo_posto_grad_id, tpg.nome_abrev AS tipo_posto_grad,
    u.tipo_turno_id, tt.nome AS tipo_turno,
    u.ativo, u.administrador
    FROM dgeo.usuario AS u
    INNER JOIN dominio.tipo_posto_grad AS tpg ON tpg.code = u.tipo_posto_grad_id
    INNER JOIN dominio.tipo_turno AS tt ON tt.code = u.tipo_turno_id`
  )
}

controller.criaUsuarioCompleto = async (
  login,
  senha,
  nome,
  nomeGuerra,
  tipoPostoGradId,
  tipoTurnoId,
  ativo,
  administrador,
  uuid
) => {
  const usuarioExiste = await db.conn.oneOrNone(
    'SELECT id FROM dgeo.usuario WHERE login = $<login>',
    { login }
  )

  if (usuarioExiste) {
    throw new AppError('Usuário com esse login já existe', httpCode.BadRequest)
  }

  const hash = await bcrypt.hash(senha, 10)

  if (uuid) {
    return db.conn.none(
      `INSERT INTO dgeo.usuario(login, senha, nome, nome_guerra, administrador, ativo, tipo_posto_grad_id, tipo_turno_id, uuid)
      VALUES ($<login>, $<hash>, $<nome>, $<nomeGuerra>, $<administrador>, $<ativo>, $<tipoPostoGradId>, $<tipoTurnoId>, $<uuid>)`,
      { login, hash, nome, nomeGuerra, tipoPostoGradId, tipoTurnoId, ativo, administrador, uuid }
    )
  }

  return db.conn.none(
    `INSERT INTO dgeo.usuario(login, senha, nome, nome_guerra, administrador, ativo, tipo_posto_grad_id, tipo_turno_id)
    VALUES ($<login>, $<hash>, $<nome>, $<nomeGuerra>, $<administrador>, $<ativo>, $<tipoPostoGradId>, $<tipoTurnoId>)`,
    { login, hash, nome, nomeGuerra, tipoPostoGradId, tipoTurnoId, ativo, administrador }
  )
}

controller.updateUsuarioCompleto = async (
  uuid,
  login,
  nome,
  nomeGuerra,
  tipoPostoGradId,
  tipoTurnoId,
  ativo,
  administrador,
  novoUuid
) => {
  const result = await db.conn.result(
    `UPDATE dgeo.usuario
    SET login = $<login>, nome = $<nome>, nome_guerra = $<nomeGuerra>, tipo_posto_grad_id = $<tipoPostoGradId>,
    tipo_turno_id = $<tipoTurnoId>, ativo = $<ativo>, administrador = $<administrador>, uuid = $<novoUuid>
    WHERE uuid = $<uuid>`,
    {
      uuid,
      login,
      nome,
      nomeGuerra,
      tipoPostoGradId,
      tipoTurnoId,
      ativo,
      administrador,
      novoUuid
    }
  )

  if (!result.rowCount || result.rowCount < 1) {
    throw new AppError('Usuário não encontrado', httpCode.NotFound)
  }
}

controller.updateSenha = async (uuid, senhaAtual, senhaNova) => {
  await loginController.verifyPassword(uuid, senhaAtual)

  const hash = await bcrypt.hash(senhaNova, 10)

  const result = await db.conn.result(
    `UPDATE dgeo.usuario
    SET senha = $<hash>
    WHERE uuid = $<uuid> AND ativo IS TRUE`,
    { uuid, hash }
  )
  if (!result.rowCount || result.rowCount < 1) {
    throw new AppError('Usuário não encontrado', httpCode.NotFound)
  }
}

controller.updateUsuario = async (
  uuid,
  nome,
  nomeGuerra,
  tipoPostoGradId,
  tipoTurnoId
) => {
  const result = await db.conn.result(
    `UPDATE dgeo.usuario
    SET nome = $<nome>, nome_guerra = $<nomeGuerra>, tipo_posto_grad_id = $<tipoPostoGradId>,
    tipo_turno_id = $<tipoTurnoId>
    WHERE uuid = $<uuid>`,
    {
      uuid,
      nome,
      nomeGuerra,
      tipoPostoGradId,
      tipoTurnoId
    }
  )
  if (!result.rowCount || result.rowCount < 1) {
    throw new AppError('Usuário não encontrado', httpCode.NotFound)
  }
}

controller.deletaUsuario = async uuid => {
  return db.conn.tx(async t => {
    const adm = await t.oneOrNone(
      `SELECT uuid FROM dgeo.usuario 
      WHERE uuid = $<uuid> AND administrador IS TRUE `,
      { uuid }
    )

    if (adm) {
      throw new AppError('Usuário com privilégio de administrador não pode ser deletado', httpCode.BadRequest)
    }
    await t.none(
      `UPDATE dgeo.login
      SET usuario_id = NULL
      WHERE usuario_id IN 
      (SELECT id FROM dgeo.usuario WHERE uuid = $<uuid> AND administrador IS FALSE)`,
      { uuid }
    )
    const result = await t.result(
      'DELETE FROM dgeo.usuario WHERE uuid = $<uuid> AND administrador IS FALSE',
      { uuid }
    )
    if (!result.rowCount || result.rowCount < 1) {
      throw new AppError('Usuário não encontrado', httpCode.NotFound)
    }
  })
}

controller.getUsuario = async uuid => {
  const usuario = db.conn.oneOrNone(
    `SELECT u.uuid, u.login, u.nome, u.nome_guerra, u.tipo_posto_grad_id, tpg.nome_abrev AS tipo_posto_grad,
    u.tipo_turno_id, tt.nome AS tipo_turno
    FROM dgeo.usuario AS u
    INNER JOIN dominio.tipo_posto_grad AS tpg ON tpg.code = u.tipo_posto_grad_id
    INNER JOIN dominio.tipo_turno AS tt ON tt.code = u.tipo_turno_id
    WHERE u.ativo IS TRUE AND u.uuid = $<uuid>`, { uuid }
  )

  if (!usuario) {
    throw new AppError('Usuário não encontrado', httpCode.BadRequest)
  }

  return usuario
}

controller.getUsuarios = async () => {
  return db.conn.any(
    `SELECT u.uuid, u.login, u.nome, u.nome_guerra, u.tipo_posto_grad_id, tpg.nome_abrev AS tipo_posto_grad,
    u.tipo_turno_id, tt.nome AS tipo_turno
    FROM dgeo.usuario AS u
    INNER JOIN dominio.tipo_posto_grad AS tpg ON tpg.code = u.tipo_posto_grad_id
    INNER JOIN dominio.tipo_turno AS tt ON tt.code = u.tipo_turno_id
    WHERE u.ativo IS TRUE`
  )
}

controller.criaUsuario = async (
  login,
  senha,
  nome,
  nomeGuerra,
  tipoPostoGradId,
  tipoTurnoId
) => {
  const usuarioExiste = await db.conn.oneOrNone(
    'SELECT id FROM dgeo.usuario WHERE login = $<login>',
    { login }
  )

  if (usuarioExiste) {
    throw new AppError('Usuário com esse login já existe', httpCode.BadRequest)
  }

  const hash = await bcrypt.hash(senha, 10)

  return db.conn.none(
    `INSERT INTO dgeo.usuario(login, senha, nome, nome_guerra, administrador, ativo, tipo_posto_grad_id, tipo_turno_id)
    VALUES ($<login>, $<hash>, $<nome>, $<nomeGuerra>, FALSE, FALSE, $<tipoPostoGradId>, $<tipoTurnoId>)`,
    { login, hash, nome, nomeGuerra, tipoPostoGradId, tipoTurnoId }
  )
}

module.exports = controller
