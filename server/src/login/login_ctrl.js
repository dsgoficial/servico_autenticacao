'use strict'

const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')

const { db } = require('../database')

const {
  AppError,
  httpCode,
  config: { JWT_SECRET }
} = require('../utils')

const controller = {}

const gravaLogin = async usuarioId => {
  await db.conn.any(
    `
      INSERT INTO dgeo.login(usuario_id, data_login) VALUES($<usuarioId>, now())
      `,
    { usuarioId }
  )
}

const signJWT = (data, secret) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      secret,
      {
        expiresIn: '1h'
      },
      (err, token) => {
        if (err) {
          reject(new AppError('Erro durante a assinatura do token', null, err))
        }
        resolve(token)
      }
    )
  })
}

const verifyPassword = async (senhaFornecida, senhaDb) => {
  return bcrypt.compare(senhaFornecida, senhaDb)
}

controller.login = async (usuario, senha) => {
  const usuarioDb = await db.conn.oneOrNone(
    'SELECT id, uuid, administrador, senha FROM dgeo.usuario WHERE login = $<usuario> and ativo IS TRUE',
    { usuario }
  )
  if (!usuarioDb) {
    throw new AppError(
      'Usuário não autorizado para utilizar o Serviço de Autenticação',
      httpCode.BadRequest
    )
  }

  const correctPassword = await verifyPassword(senha, usuarioDb.senha)
  if (!correctPassword) {
    throw new AppError('Usuário ou senha inválida', httpCode.BadRequest)
  }

  const { id, uuid, administrador } = usuarioDb

  const token = await signJWT({ uuid, administrador }, JWT_SECRET)

  await gravaLogin(id)

  return { token, administrador }
}

controller.verifyPassword = async (uuid, senha) => {
  const usuarioDb = await db.conn.oneOrNone(
    'SELECT id, uuid, administrador, senha FROM dgeo.usuario WHERE uuid = $<uuid> and ativo IS TRUE',
    { uuid }
  )
  if (!usuarioDb) {
    throw new AppError(
      'Usuário não autorizado para utilizar o Serviço de Autenticação',
      httpCode.BadRequest
    )
  }

  const correctPassword = await verifyPassword(senha, usuarioDb.senha)
  if (!correctPassword) {
    throw new AppError('Usuário ou senha inválida', httpCode.BadRequest)
  }
}

module.exports = controller
