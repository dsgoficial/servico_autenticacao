'use strict'

const Joi = require('joi')

const models = {}

models.idParams = Joi.object().keys({
  id: Joi.number()
    .integer()
    .required()
})

models.aplicacao = Joi.object().keys({
  nome: Joi.string().required(),
  nome_abrev: Joi.string().required(),
  ativa: Joi.boolean().strict()
})

module.exports = models
