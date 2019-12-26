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
  schemaValidation({ query: usuarioSchema.filtroUsuariosQuery }),
  asyncHandler(async (req, res, next) => {
    const dados = await usuarioCtrl.getUsuarios(
      req.params.autorizados,
      req.params.administradores
    )

    const msg = 'Informação dos usuários retornada com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.post(
  '/deletar',
  verifyAdmin,
  schemaValidation({ body: usuarioSchema.listaUsuarios }),
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.deletaUsuarios(req.body.usuariosUuid)

    const msg = 'Usuários deletados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.post(
  '/senha/resetar',
  verifyAdmin,
  schemaValidation({ body: usuarioSchema.listaUsuarios }),
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.resetaSenhaUsuarios(req.body.usuariosUuid)

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
      req.body.usuariosUuid,
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

router.post(
  '/:uuid/administrador/:administrador',
  verifyAdmin,
  schemaValidation({ params: usuarioSchema.admParams }),
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.modificaNivelAcesso(
      req.params.uuid,
      req.params.administrador
    )

    const msg = 'Nivel de acesso atualizado com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
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
    await usuarioCtrl.updateSenha(req.params.uuid, req.body.senha)

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

router.put(
  '/:uuid',
  verifyAdmin,
  schemaValidation({
    body: usuarioSchema.atualizacaoAdmUsuario,
    params: usuarioSchema.uuidParams
  }),
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.updateUsuarioCompleto(
      req.params.uuid,
      req.params.login,
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
