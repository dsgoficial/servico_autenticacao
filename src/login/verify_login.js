'use strict'

const { AppError, asyncHandler, httpCode } = require('../utils')

const validateToken = require('./validate_token')

// middleware para verificar o JWT
const verifyLogin = asyncHandler(async (req, res, next) => {
  const usuarioUuid = req.params.uuid
  // verifica o header authorization para pegar o token
  const token = req.headers.authorization

  const decoded = await validateToken(token)

  if (decoded.uuid !== usuarioUuid) {
    throw new AppError(
      'Usuário só pode acessar sua própria informação',
      httpCode.Unauthorized
    )
  }

  req.body.usuarioUuid = decoded.uuid
  next()
})

module.exports = verifyLogin
