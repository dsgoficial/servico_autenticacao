'use strict'

const Joi = require('joi')

const models = {}

models.uuidParams = Joi.object().keys({
  uuid: Joi.string()
    .guid()
    .required()
})

models.ativoParams = Joi.object().keys({
  ativo: Joi.string().valid('true', 'false')
})

models.paginacaoUsuariosQuery = Joi.object().keys({
  pagina: Joi.number().integer().min(1),
  total_pagina: Joi.number().integer().min(5)
})

models.listaUsuarios = Joi.object().keys({
  usuarios_uuids: Joi.array()
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
  validade_identidade: Joi.date().allow(null).required(),
  orgao_expedidor: Joi.string().allow('').required(),
  banco: Joi.string().allow('').required(),
  agencia: Joi.string().allow('').required(),
  conta_bancaria: Joi.string().allow('').required(),
  data_nascimento: Joi.date().allow(null).required(),
  celular: Joi.string().allow('').required(),
  email_eb: Joi.string().allow('').required()
})

models.atualizacaoSenha = Joi.object().keys({
  senha_atual: Joi.string().required(),
  senha_nova: Joi.string().required()
})

models.atualizacaoAdmUsuario = Joi.object().keys({
  usuario: Joi.string().required(),
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
  validade_identidade: Joi.date().allow(null).required(),
  orgao_expedidor: Joi.string().allow('').required(),
  banco: Joi.string().allow('').required(),
  agencia: Joi.string().allow('').required(),
  conta_bancaria: Joi.string().allow('').required(),
  data_nascimento: Joi.date().allow(null).required(),
  celular: Joi.string().allow('').required(),
  email_eb: Joi.string().allow('').required(),
  administrador: Joi.boolean()
    .strict()
    .required(),
  ativo: Joi.boolean()
    .strict()
    .required()
})

module.exports = models
