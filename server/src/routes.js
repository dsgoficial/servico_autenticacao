'use strict'
const express = require('express')
const { databaseVersion } = require('./database')

const {
  httpCode
} = require('./utils')

const { loginRoute } = require('./login')
const { usuariosRoute } = require('./usuarios')
const { aplicacoesRoute } = require('./aplicacoes')
const { dashboardRoute } = require('./dashboard')

const router = express.Router()

router.get('/', (req, res, next) => {
  return res.sendJsonAndLog(
    true,
    'Serviço de autenticação operacional',
    httpCode.OK,
    {
      database_version: databaseVersion.nome
    }
  )
})

router.use('/login', loginRoute)
router.use('/usuarios', usuariosRoute)
router.use('/aplicacoes', aplicacoesRoute)
router.use('/dashboard', dashboardRoute)

module.exports = router
