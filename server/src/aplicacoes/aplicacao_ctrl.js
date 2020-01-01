'use strict'

const { db } = require('../database')

const { AppError, httpCode } = require('../utils')

const controller = {}

controller.getAplicacao = async () => {
  return db.conn.any(
    `SELECT id, nome, nome_abrev, ativa
    FROM dgeo.aplicacao`
  )
}

controller.deletaAplicacao = async id => {
  return db.conn.tx(async t => {
    const aplicacaoDefault = await t.oneOrNone(
      `SELECT id FROM dgeo.aplicacao 
      WHERE id IN ($<id>) AND nome_abrev IN ('auth_web', 'sap_fp', 'sap_fg', 'sap_web', 'sca_qgis', 'sca_web', 'scm_web', 'dsgdocs_web', 'sapdashboard_web')`,
      { id }
    )

    if (aplicacaoDefault) {
      throw new AppError('As aplicações padrão não devem ser deletadas', httpCode.BadRequest)
    }

    await t.none(
      `DELETE FROM dgeo.login WHERE aplicacao_id IN 
      (SELECT id FROM dgeo.aplicacao WHERE id IN ($<id>))`,
      { id }
    )
    const result = await t.result(
      'DELETE FROM dgeo.aplicacao WHERE id IN ($<id>)',
      { id }
    )
    if (!result.rowCount || result.rowCount < 1) {
      throw new AppError('Usuário não encontrado', httpCode.NotFound)
    }
  })
}

controller.criaAplicacao = async (
  nome,
  nomeAbrev,
  ativa
) => {
  return db.conn.task(async t => {
    const existe = await t.oneOrNone(
      'SELECT id FROM dgeo.aplicacao WHERE nome = $<nome> OR nome_abrev = $<nomeAbrev>',
      { nome, nomeAbrev }
    )

    if (existe) {
      throw new AppError('Aplicação com esse nome ou nome_abrev já existe', httpCode.BadRequest)
    }

    t.none(
      `INSERT INTO dgeo.aplicacao(nome, nome_abrev, ativa)
    VALUES ($<nome>, $<nomeAbrev>, $<ativa>)`,
      { nome, nomeAbrev, ativa }
    )
  })
}

controller.updateAplicacao = async (
  id,
  nome,
  nomeAbrev,
  ativa
) => {
  return db.conn.task(async t => {
    const existe = await t.oneOrNone(
      'SELECT id FROM dgeo.aplicacao WHERE id = $<id>',
      { id }
    )

    if (existe) {
      throw new AppError('Id não corresponde a nenhuma aplicação', httpCode.NotFound)
    }

    const colisao = await t.oneOrNone(
      'SELECT id FROM dgeo.aplicacao WHERE id != $<id> AND (nome = $<nome> OR nome_abrev = $<nomeAbrev>) LIMIT 1',
      { id, nome, nomeAbrev }
    )

    if (colisao) {
      throw new AppError('Aplicação com esse nome ou nome_abrev já existe', httpCode.BadRequest)
    }

    const aplicacaoDefault = await t.oneOrNone(
      `SELECT id FROM dgeo.aplicacao 
      WHERE id IN ($<id>) AND nome_abrev IN ('auth_web', 'sap_fp', 'sap_fg', 'sap_web', 'sca_qgis', 'sca_web', 'scm_web', 'dsgdocs_web', 'sapdashboard_web')
      AND (nome != $<nome> OR nome_abrev != $<nomeAbrev>)`,
      { id, nome, nomeAbrev }
    )

    if (aplicacaoDefault) {
      throw new AppError('O nome e nome_abrev de aplicações padrão não devem ser modificados', httpCode.BadRequest)
    }

    t.none(
      `UPDATE dgeo.aplicacao
      SET nome = $<nome>, nome_abrev = $<nomeAbrev>, ativa = $<ativa>
      WHERE id = $<id>`,
      { id, nome, nomeAbrev, ativa }
    )
  })
}

module.exports = controller
