'use strict'

const express = require('express')

const { asyncHandler, httpCode, schemaValidation } = require('../utils')

const dashboardCtrl = require('./dashboard_ctrl')
const dashboardSchema = require('./dashboard_schema')

const router = express.Router()

router.get(
  '/usuarios_logados',
  asyncHandler(async (req, res, next) => {
    const dados = await dashboardCtrl.getUsuariosLogados()

    const msg = 'Usuários logados retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.get(
  '/usuarios_ativos',
  asyncHandler(async (req, res, next) => {
    const dados = await dashboardCtrl.getUsuariosAtivos()

    const msg = 'Número de usuários ativos retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.get(
  '/aplicacoes_ativas',
  asyncHandler(async (req, res, next) => {
    const dados = await dashboardCtrl.getAplicacoesAtivas()

    const msg = 'Número de aplicações ativas retornadas com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.get(
  '/logins/dia',
  schemaValidation({
    query: dashboardSchema.totalQuery
  }),
  asyncHandler(async (req, res, next) => {
    const dados = await dashboardCtrl.getLoginsDia(req.query.total)

    const msg = 'Logins por dia retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.get(
  '/logins/mes',
  schemaValidation({
    query: dashboardSchema.totalQuery
  }),
  asyncHandler(async (req, res, next) => {
    const dados = await dashboardCtrl.getLoginsMes(req.query.total)

    const msg = 'Logins por mês retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.get(
  '/logins/aplicacoes',
  schemaValidation({
    query: dashboardSchema.totalMaxQuery
  }),
  asyncHandler(async (req, res, next) => {
    const dados = await dashboardCtrl.getLoginsAplicacoes(req.query.total, req.query.max)

    const msg = 'Logins por aplicações retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.get(
  '/logins/usuarios',
  schemaValidation({
    query: dashboardSchema.totalMaxQuery
  }),
  asyncHandler(async (req, res, next) => {
    const dados = await dashboardCtrl.getLoginsUsuarios(req.query.total, req.query.max)

    const msg = 'Logins por usuários retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

module.exports = router
