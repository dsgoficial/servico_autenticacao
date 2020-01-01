'use strict'

const express = require('express')

const { schemaValidation, asyncHandler, httpCode } = require('../utils')

const { verifyLogin, verifyAdmin } = require('../login')

const usuarioCtrl = require('./usuario_ctrl')
const usuarioSchema = require('./usuario_schema')

const router = express.Router()

router.get(
  '/completo',
  verifyAdmin,
  schemaValidation({ query: usuarioSchema.paginacaoUsuariosQuery }),
  asyncHandler(async (req, res, next) => {
    const dados = await usuarioCtrl.getUsuarios(
      req.query.pagina,
      req.query.total_pagina,
      req.query.coluna_ordem,
      req.query.direcao_ordem,
      req.query.filtro
    )

    const msg = 'Informação dos usuários retornada com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.put(
  '/completo/:uuid',
  schemaValidation({
    body: usuarioSchema.atualizacaoUsuario,
    params: usuarioSchema.uuidParams
  }),
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.updateUsuarioCompleto(
      req.params.uuid,
      req.body.usuario,
      req.body.nome,
      req.body.nome_guerra,
      req.body.administrador,
      req.body.ativo,
      req.body.tipo_turno_id,
      req.body.tipo_posto_grad_id,
      req.body.cpf,
      req.body.identidade,
      req.body.validade_identidade,
      req.body.orgao_expedidor,
      req.body.banco,
      req.body.agencia,
      req.body.conta_bancaria,
      req.body.data_nascimento,
      req.body.celular,
      req.body.email_eb
    )

    const msg = 'Usuário atualizado com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.post(
  '/senha/resetar',
  verifyAdmin,
  schemaValidation({ body: usuarioSchema.listaUsuarios }),
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.resetaSenhaUsuarios(req.body.usuarios_uuids)

    const msg = 'Senha resetada com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.post(
  '/autorizar/:ativo',
  verifyAdmin,
  schemaValidation({
    body: usuarioSchema.listaUsuarios,
    params: usuarioSchema.ativoParams
  }),
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.modificaAutorizacao(
      req.body.usuarios_uuids,
      req.params.ativo
    )

    const msg = 'Autorização atualizada com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.get(
  '/tipo_posto_grad',
  asyncHandler(async (req, res, next) => {
    const dados = await usuarioCtrl.getTipoPostoGrad()

    const msg = 'Tipos de Posto e Graduação retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.get(
  '/tipo_turno',
  asyncHandler(async (req, res, next) => {
    const dados = await usuarioCtrl.getTipoTurno()

    const msg = 'Tipos de Turno retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.put(
  '/:uuid/senha',
  schemaValidation({
    body: usuarioSchema.atualizacaoSenha,
    params: usuarioSchema.uuidParams
  }),
  verifyLogin,
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.updateSenha(req.params.uuid, req.body.senha_atual, req.body.senha_nova)

    const msg = 'Senha do usuário atualizada com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.get(
  '/:uuid',
  schemaValidation({ params: usuarioSchema.uuidParams }),
  verifyLogin,
  asyncHandler(async (req, res, next) => {
    const dados = await usuarioCtrl.getUsuario(req.params.uuid)

    const msg = 'Informação do usuário retornada com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.put(
  '/:uuid',
  schemaValidation({
    body: usuarioSchema.atualizacaoUsuario,
    params: usuarioSchema.uuidParams
  }),
  verifyLogin,
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.updateUsuario(
      req.params.uuid,
      req.body.nome,
      req.body.nome_guerra,
      req.body.tipo_turno_id,
      req.body.tipo_posto_grad_id,
      req.body.cpf,
      req.body.identidade,
      req.body.validade_identidade,
      req.body.orgao_expedidor,
      req.body.banco,
      req.body.agencia,
      req.body.conta_bancaria,
      req.body.data_nascimento,
      req.body.celular,
      req.body.email_eb
    )

    const msg = 'Usuário atualizado com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.delete(
  '/:uuid',
  schemaValidation({
    params: usuarioSchema.uuidParams
  }),
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.deletaUsuario(req.params.uuid)

    const msg = 'Usuário deletado com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const dados = await usuarioCtrl.getInfoPublicaUsuarios()

    const msg = 'Usuários retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.post(
  '/',
  schemaValidation({ body: usuarioSchema.criacaoUsuario }),
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.criaUsuario(
      req.body.usuario,
      req.body.senha,
      req.body.nome,
      req.body.nome_guerra,
      req.body.tipo_turno_id,
      req.body.tipo_posto_grad_id
    )
    const msg = 'Usuário criado com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.Created)
  })
)

module.exports = router
