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
    `SELECT u.uuid, u.login, u.nome, u.nome_guerra, u.tipo_turno_id, u.tipo_posto_grad_id, tpg.nome AS tipo_posto_grad
    FROM dgeo.usuario AS u
    INNER JOIN dominio.tipo_posto_grad AS tpg ON tpg.code = u.tipo_posto_grad_id
    WHERE u.ativo IS TRUE`
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
    `SELECT id, uuid, login, nome, nome_guerra, tipo_turno_id, tipo_posto_grad_id,
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

controller.getUsuarios = async (pagina, totalPagina, colunaOrdem, direcaoOrdem, filtro) => {
  let where = ''

  if (filtro) {
    where = ` WHERE lower(concat_ws('|',u.login,u.nome,u.nome_guerra,tpg.nome_abrev, tt.nome)) LIKE '%${filtro.toLowerCase()}%'`
  }

  let sort = ''
  if (colunaOrdem) {
    if (direcaoOrdem) {
      sort = ` ORDER BY u.${colunaOrdem} ${direcaoOrdem}`
    } else {
      sort = ` ORDER BY u.${colunaOrdem} ASC`
    }
  }

  let paginacao = ''

  if (pagina && totalPagina) {
    paginacao = ` LIMIT ${totalPagina} OFFSET (${pagina} - 1)*${totalPagina}`
  }

  const sql = `SELECT u.id, u.uuid, u.login, u.nome, u.nome_guerra, u.ativo, u.administrador, u.tipo_turno_id, u.tipo_posto_grad_id,
  u.cpf, u.identidade, u.validade_identidade, u.orgao_expedidor, u.banco, u.agencia, u.conta_bancaria, u.data_nascimento, u.celular,
  u.email_eb, tpg.nome_abrev AS tipo_posto_grad, tt.nome AS tipo_turno
  FROM dgeo.usuario AS u 
  INNER JOIN dominio.tipo_posto_grad AS tpg ON tpg.code = u.tipo_posto_grad_id
  INNER JOIN dominio.tipo_turno AS tt ON tt.code = u.tipo_turno_id
  ${where} ${sort} ${paginacao}`

  const usuarios = await db.conn.any(sql)

  const result = { usuarios }

  result.total = usuarios.length

  return result
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
