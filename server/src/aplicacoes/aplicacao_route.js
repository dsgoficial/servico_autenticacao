'use strict'

const express = require('express')

const { schemaValidation, asyncHandler, httpCode } = require('../utils')

const { verifyAdmin } = require('../login')

const aplicacaoCtrl = require('./aplicacao_ctrl')
const aplicacaoSchema = require('./aplicacao_schema')

const router = express.Router()

router.put(
  '/:id',
  schemaValidation({
    body: aplicacaoSchema.aplicacao,
    params: aplicacaoSchema.idParams
  }),
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    await aplicacaoCtrl.updateAplicacao(
      req.params.id,
      req.body.nome,
      req.body.nome_abrev,
      req.body.ativa
    )

    const msg = 'Aplicação atualizada com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.delete(
  '/:id',
  schemaValidation({
    params: aplicacaoSchema.idParams
  }),
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    await aplicacaoCtrl.deletaAplicacao(req.params.id)

    const msg = 'Aplicação deletada com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const dados = await aplicacaoCtrl.getAplicacao()

    const msg = 'Aplicações retornadas com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.post(
  '/',
  verifyAdmin,
  schemaValidation({ body: aplicacaoSchema.aplicacao }),
  asyncHandler(async (req, res, next) => {
    await aplicacaoCtrl.criaAplicacao(
      req.body.nome,
      req.body.nome_abrev,
      req.body.ativa
    )
    const msg = 'Aplicação adicionada com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.Created)
  })
)

module.exports = router
