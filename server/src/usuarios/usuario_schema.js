'use strict'

const Joi = require('joi')

const models = {}

models.uuidParams = Joi.object().keys({
  uuid: Joi.string()
    .guid()
    .required()
})

models.admParams = Joi.object().keys({
  uuid: Joi.string()
    .guid()
    .required(),
  administrador: Joi.string().valid('true', 'false')
})

models.ativoParams = Joi.object().keys({
  ativo: Joi.string().valid('true', 'false')
})

models.filtroUsuariosQuery = Joi.object().keys({
  autorizados: Joi.string().valid('true', 'false'),
  administradores: Joi.string().valid('true', 'false')
})

models.listaUsuarios = Joi.object().keys({
  usuariosUuid: Joi.array()
    .items(Joi.string().guid())
    .required()
    .min(1)
})

models.criacaoUsuario = Joi.object().keys({
  usuario: Joi.string().required(),
  senha: Joi.string().required(),
  nome: Joi.string().required(),
  nome_guerra: Joi.string().required(),
  tipo_turno_id: Joi.number()
    .integer()
    .strict()
    .required(),
  tipo_posto_grad_id: Joi.number()
    .integer()
    .strict()
    .required()
})

models.atualizacaoUsuario = Joi.object().keys({
  nome: Joi.string().required(),
  nome_guerra: Joi.string().required(),
  tipo_turno_id: Joi.number()
    .integer()
    .strict()
    .required(),
  tipo_posto_grad_id: Joi.number()
    .integer()
    .strict()
    .required(),
  cpf: Joi.string().allow('').required(),
  identidade: Joi.string().allow('').required(),
  validade_identidade: Joi.string().allow('').required(),
  orgao_expedidor: Joi.string().allow('').required(),
  banco: Joi.string().allow('').required(),
  agencia: Joi.string().allow('').required(),
  conta_bancaria: Joi.string().allow('').required(),
  data_nascimento: Joi.string().allow('').required(),
  celular: Joi.string().allow('').required(),
  email_eb: Joi.string().allow('').required()
})

models.atualizacaoSenha = Joi.object().keys({
  senha_atual: Joi.string().required(),
  senha_nova: Joi.string().required()
})

models.atualizacaoAdmUsuario = Joi.object().keys({
  usuario: Joi.string().required(),
  login: Joi.string().required(),
  nome: Joi.string().required(),
  nome_guerra: Joi.string().required(),
  administrador: Joi.boolean()
    .strict()
    .required(),
  ativo: Joi.boolean()
    .strict()
    .required(),
  tipo_turno_id: Joi.number()
    .integer()
    .strict()
    .required(),
  tipo_posto_grad_id: Joi.number()
    .integer()
    .strict()
    .required(),
  cpf: Joi.string().required(),
  identidade: Joi.string().required(),
  validade_identidade: Joi.string().required(),
  orgao_expedidor: Joi.string().required(),
  banco: Joi.string().required(),
  agencia: Joi.string().required(),
  conta_bancaria: Joi.string().required(),
  data_nascimento: Joi.string().required(),
  celular: Joi.string().required(),
  email_eb: Joi.string().required()
})

module.exports = models
