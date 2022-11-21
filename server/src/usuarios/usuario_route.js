'use strict'

const express = require('express')

const { schemaValidation, asyncHandler, httpCode } = require('../utils')

const { verifyLogin, verifyAdmin } = require('../login')

const usuarioCtrl = require('./usuario_ctrl')
const usuarioSchema = require('./usuario_schema')
const LDAPusersCtrl = require('./ldap_ctrl')

const router = express.Router()

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
  '/autorizacao/:ativo',
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

router.get(
  '/completo',
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    const dados = await usuarioCtrl.getUsuariosCompleto()

    const msg = 'Usuários retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.post(
  '/getldapusers',
  asyncHandler(async (req, res, next) => {
    LDAPusersCtrl.getLDAPusers(
      req.body.ldapurl,
      req.body.basedn)
      .then(function (dados) {
        if (typeof dados === 'string'){
          dados = {'errno': dados};
          var msg = 'Erro';
        }else{
          var msg = 'Usuários retornados com sucesso';
        }
        return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
    });
  })
)

router.post(
  '/saveldapenv',
  asyncHandler(async (req, res, next) => {
    LDAPusersCtrl.setLDAPenv(
      req.body.basedn,
      req.body.ldapurl,)
      .then(function (dados) {
        const msg = 'Arquivo salvo com sucesso';
        return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
    });
  })
)

router.get(
  '/getldapenv',
  asyncHandler(async (req, res, next) => {
    LDAPusersCtrl.getLDAPenv().then(function (dados) {
        const msg = 'Arquivo lido com sucesso';
        return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
    });
  })
)

router.post(
  '/upsertldapuser',
  asyncHandler(async (req, res, next) => {
    LDAPusersCtrl.upsertLDAPuser(
      req.body.usuario,
      req.body.nome,
      req.body.nomeGuerra
    ).then(function (dados) {
        const msg = 'Arquivo lido com sucesso';
        return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
    });
  })
)

router.post(
  '/completo',
  verifyAdmin,
  schemaValidation({ body: usuarioSchema.criacaoUsuarioCompleto }),
  asyncHandler(async (req, res, next) => {
    const dados = await usuarioCtrl.criaUsuarioCompleto(
      req.body.usuario,
      req.body.senha,
      req.body.nome,
      req.body.nome_guerra,
      req.body.tipo_posto_grad_id,
      req.body.tipo_turno_id,
      req.body.ativo,
      req.body.administrador,
      req.body.uuid
    )

    const msg = 'Usuários retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.put(
  '/completo/:usuario_uuid',
  schemaValidation({
    body: usuarioSchema.atualizacaoUsuarioCompleto,
    params: usuarioSchema.uuidParams
  }),
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.updateUsuarioCompleto(
      req.params.usuario_uuid,
      req.body.usuario,
      req.body.nome,
      req.body.nome_guerra,
      req.body.tipo_posto_grad_id,
      req.body.tipo_turno_id,
      req.body.ativo,
      req.body.administrador,
      req.body.uuid
    )

    const msg = 'Usuário atualizado com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.put(
  '/:usuario_uuid/senha',
  schemaValidation({
    body: usuarioSchema.atualizacaoSenha,
    params: usuarioSchema.uuidParams
  }),
  verifyLogin,
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.updateSenha(req.params.usuario_uuid, req.body.senha_atual, req.body.senha_nova)

    const msg = 'Senha do usuário atualizada com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)
router.put(
  '/:usuario_uuid',
  schemaValidation({
    body: usuarioSchema.atualizacaoUsuario,
    params: usuarioSchema.uuidParams
  }),
  verifyLogin,
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.updateUsuario(
      req.params.usuario_uuid,
      req.body.nome,
      req.body.nome_guerra,
      req.body.tipo_posto_grad_id,
      req.body.tipo_turno_id
    )

    const msg = 'Usuário atualizado com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.delete(
  '/:usuario_uuid',
  schemaValidation({
    params: usuarioSchema.uuidParams
  }),
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    await usuarioCtrl.deletaUsuario(req.params.usuario_uuid)

    const msg = 'Usuário deletado com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK)
  })
)

router.get(
  '/:usuario_uuid',
  schemaValidation({
    params: usuarioSchema.uuidParams
  }),
  asyncHandler(async (req, res, next) => {
    const dados = await usuarioCtrl.getUsuario(req.params.usuario_uuid)

    const msg = 'Usuários retornados com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.OK, dados)
  })
)

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const dados = await usuarioCtrl.getUsuarios()

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
      req.body.tipo_posto_grad_id,
      req.body.tipo_turno_id
    )
    const msg = 'Usuário criado com sucesso'

    return res.sendJsonAndLog(true, msg, httpCode.Created)
  })
)

module.exports = router
