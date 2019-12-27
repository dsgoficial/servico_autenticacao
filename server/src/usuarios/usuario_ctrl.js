'use strict'

const { db } = require('../database')

const { AppError, httpCode } = require('../utils')

const { loginController } = require('../login')

const bcrypt = require('bcryptjs')

const controller = {}

controller.criaUsuario = async (
  login,
  senha,
  nome,
  nomeGuerra,
  tipoTurnoId,
  tipoPostoGradId
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
    `INSERT INTO dgeo.usuario(login, senha, nome, nome_guerra, administrador, ativo, tipo_turno_id, tipo_posto_grad_id)
    VALUES ($<login>, $<hash>, $<nome>, $<nomeGuerra>, FALSE, FALSE, $<tipoTurnoId>, $<tipoPostoGradId>)`,
    { login, hash, nome, nomeGuerra, tipoTurnoId, tipoPostoGradId }
  )
}

controller.getInfoPublicaUsuarios = async () => {
  return db.conn.any(
    `SELECT uuid, nome, nome_guerra, tipo_turno_id, tipo_posto_grad_id
    FROM dgeo.usuario WHERE ativo IS TRUE`
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

controller.getUsuario = async uuid => {
  const usuario = await db.conn.oneOrNone(
    `SELECT uuid, login, nome, nome_guerra, tipo_turno_id, tipo_posto_grad_id,
    cpf, identidade, validade_identidade, orgao_expedidor, banco, agencia,
    conta_bancaria, data_nascimento, celular, email_eb
    FROM dgeo.usuario WHERE uuid = $<uuid> AND ativo IS TRUE`,
    { uuid }
  )

  if (!usuario) {
    throw new AppError('Usuário não encontrado', httpCode.NotFound)
  }

  return usuario
}

controller.updateUsuario = async (
  uuid,
  nome,
  nomeGuerra,
  tipoTurnoId,
  tipoPostoGradId,
  cpf,
  identidade,
  validadeIdentidade,
  orgaoExpedidor,
  banco,
  agencia,
  contaBancaria,
  dataNascimento,
  celular,
  emailEb
) => {
  if(!validadeIdentidade){
    validadeIdentidade = null
  }
  if(!dataNascimento){
    dataNascimento = null
  }
  const result = await db.conn.result(
    `UPDATE dgeo.usuario
    SET nome = $<nome>, nome_guerra = $<nomeGuerra>, tipo_turno_id = $<tipoTurnoId>, tipo_posto_grad_id = $<tipoPostoGradId>,
    cpf = $<cpf>, identidade = $<identidade>, validade_identidade = $<validadeIdentidade>, orgao_expedidor = $<orgaoExpedidor>,
    banco = $<banco>, agencia = $<agencia>, conta_bancaria = $<contaBancaria>, data_nascimento = $<dataNascimento>, 
    celular = $<celular>, email_eb = $<emailEb>
    WHERE uuid = $<uuid> AND ativo IS TRUE`,
    {
      uuid,
      nome,
      nomeGuerra,
      tipoTurnoId,
      tipoPostoGradId,
      cpf,
      identidade,
      validadeIdentidade,
      orgaoExpedidor,
      banco,
      agencia,
      contaBancaria,
      dataNascimento,
      celular,
      emailEb
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

controller.deletaUsuarios = async usuariosUUID => {
  return db.conn.tx(async t => {
    await t.none(
      `DELETE FROM dgeo.login WHERE usuario_id IN 
      (SELECT id FROM dgeo.usuario WHERE uuid IN ($<usuariosUUID:csv>))`,
      { usuariosUUID }
    )
    await t.none(
      'DELETE FROM dgeo.usuario WHERE uuid IN ($<usuariosUUID:csv>)',
      { usuariosUUID }
    )
  })
}

controller.resetaSenhaUsuarios = async usuariosUUID => {
  return db.conn.tx(async t => {
    const logins = await t.any(
      'SELECT id, login FROM dgeo.usuario WHERE uuid IN ($<usuariosUUID:csv>)',
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
    WHERE uuid IN ($<usuariosUUID:csv>)`,
    { usuariosUUID, ativo }
  )
}

controller.modificaNivelAcesso = async (usuarioUUID, administrador) => {
  return db.conn.none(
    `UPDATE dgeo.usuario
    SET administrador = $<administrador>
    WHERE uuid = $<usuarioUUID>`,
    { usuarioUUID, administrador }
  )
}

controller.getUsuarios = async (autorizados, administradores) => {
  const whereConditions = []

  if (!(autorizados == null)) {
    whereConditions.push(`ativo IS ${autorizados}`)
  }
  if (!(administradores == null)) {
    whereConditions.push(`administrador IS ${administradores}`)
  }
  let usuarios

  let sql = `SELECT uuid, login, nome, nome_guerra, ativo, administrador, tipo_turno_id, tipo_posto_grad_id,
  cpf, identidade, validade_identidade, orgao_expedidor, banco, agencia, conta_bancaria, data_nascimento, celular,
  email_eb
  FROM dgeo.usuario`

  if (whereConditions.length > 0) {
    const whereCondition = `WHERE ${whereConditions.join(' AND ')}`

    sql = `${sql} $<whereCondition:raw>`
    usuarios = await db.conn.any(sql, { whereCondition })
  } else {
    usuarios = await db.conn.any(sql)
  }

  return usuarios
}

controller.updateUsuarioCompleto = async (
  uuid,
  login,
  nome,
  nomeGuerra,
  administrador,
  ativo,
  tipoTurnoId,
  tipoPostoGradId,
  cpf,
  identidade,
  validadeIdentidade,
  orgaoExpedidor,
  banco,
  agencia,
  contaBancaria,
  dataNascimento,
  celular,
  emailEb
) => {
  if(!validadeIdentidade){
    validadeIdentidade = null
  }
  if(!dataNascimento){
    dataNascimento = null
  }
  const result = await db.conn.result(
    `UPDATE dgeo.usuario
    SET login = $<login>, nome = $<nome>, nome_guerra = $<nomeGuerra>, tipo_turno_id = $<tipoTurnoId>, 
    tipo_posto_grad_id = $<tipoPostoGradId>, ativo = $<ativo>, administrador = $<administrador>,
    cpf = $<cpf>, identidade = $<identidade>, validade_identidade = $<validadeIdentidade>, orgao_expedidor = $<orgaoExpedidor>,
    banco = $<banco>, agencia = $<agencia>, conta_bancaria = $<contaBancaria>, data_nascimento = $<dataNascimento>, 
    celular = $<celular>, email_eb = $<emailEb>
    WHERE uuid = $<uuid>`,
    {
      uuid,
      login,
      nome,
      nomeGuerra,
      tipoTurnoId,
      tipoPostoGradId,
      ativo,
      administrador,
      cpf,
      identidade,
      validadeIdentidade,
      orgaoExpedidor,
      banco,
      agencia,
      contaBancaria,
      dataNascimento,
      celular,
      emailEb
    }
  )

  if (!result.rowCount || result.rowCount < 1) {
    throw new AppError('Usuário não encontrado', httpCode.NotFound)
  }
}

module.exports = controller
