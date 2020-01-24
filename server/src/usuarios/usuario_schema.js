'use strict'

const Joi = require('joi')

const models = {}

models.uuidParams = Joi.object().keys({
  usuario_uuid: Joi.string()
    .guid({ version: 'uuidv4' })
    .required()
})

models.ativoParams = Joi.object().keys({
  ativo: Joi.string().valid('true', 'false')
})

models.listaUsuarios = Joi.object().keys({
  usuarios_uuids: Joi.array()
    .items(Joi.string().guid({ version: 'uuidv4' }))
    .required()
    .min(1)
})

models.criacaoUsuario = Joi.object().keys({
  usuario: Joi.string().required(),
  senha: Joi.string().required(),
  nome: Joi.string().required(),
  nome_guerra: Joi.string().required(),
  tipo_posto_grad_id: Joi.number()
    .integer()
    .strict()
    .required()
})

models.criacaoUsuarioCompleto = Joi.object().keys({
  usuario: Joi.string().required(),
  senha: Joi.string().required(),
  nome: Joi.string().required(),
  nome_guerra: Joi.string().required(),
  tipo_posto_grad_id: Joi.number()
    .integer()
    .strict()
    .required(),
  administrador: Joi.boolean().strict().required(),
  ativo: Joi.boolean().strict().required()
})

models.atualizacaoUsuarioCompleto = Joi.object().keys({
  usuario: Joi.string().required(),
  nome: Joi.string().required(),
  nome_guerra: Joi.string().required(),
  tipo_posto_grad_id: Joi.number()
    .integer()
    .strict()
    .required(),
  administrador: Joi.boolean().strict().required(),
  ativo: Joi.boolean().strict().required()
})

models.atualizacaoUsuario = Joi.object().keys({
  nome: Joi.string().required(),
  nome_guerra: Joi.string().required(),
  tipo_posto_grad_id: Joi.number()
    .integer()
    .strict()
    .required()
})

models.atualizacaoSenha = Joi.object().keys({
  senha_atual: Joi.string().required(),
  senha_nova: Joi.string().required()
})

module.exports = models
