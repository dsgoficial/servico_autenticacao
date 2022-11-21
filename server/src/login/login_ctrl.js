"use strict";

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const { db } = require("../database");

const { AppError, httpCode } = require("../utils");

const { JWT_SECRET } = require("../config");

const path = require('path');
const configPath = path.join(__dirname, '..', '..', 'ldap.env');
const ldap = require('ldapjs');
const dotenv = require('dotenv');
const fs = require('fs');
const data = fs.readFileSync(configPath, 'utf-8');
const config = dotenv.parse(data);
const basedn = config.basedn;
const ldapurl = config.ldapurl;

const controller = {};

const gravaLogin = async (usuarioId, aplicacaoId, connection) => {
  return connection.any(
    `
      INSERT INTO dgeo.login(usuario_id, data_login, aplicacao_id) VALUES($<usuarioId>, now(), $<aplicacaoId>)
      `,
    { usuarioId, aplicacaoId }
  );
};

const signJWT = (data, secret) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      secret,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) {
          reject(new AppError("Erro durante a assinatura do token", null, err));
        }
        resolve(token);
      }
    );
  });
};

const comparePassword = async (senhaFornecida, senhaDb) => {
  return bcrypt.compare(senhaFornecida, senhaDb);
};

const compareLDAPPassword = async (senha, usuario) => {
  return new Promise(function(resolve, reject) {
    const opts = {
         filter: '(objectClass=inetOrgPerson)',
         scope: 'sub',
         attributes: ['givenName', 'sn', 'cn'],
       };
 
     const client = ldap.createClient({
       url: [ldapurl]
     });
      
     client.on('error', (err) => {
       console.log(err);
       resolve(false);
     });
     client.bind(`cn=${usuario},${basedn}`, senha, (err) => {
      if(err){
        console.log(err);
        resolve(false);
      }
      else{
        resolve(true);
      }
    });
  });
 }

controller.login = async (usuario, senha, aplicacao) => {
  return db.conn.tx(async (t) => {
    const aplicacaoId = await t.oneOrNone(
      "SELECT id FROM dgeo.aplicacao WHERE nome_abrev = $<aplicacao> and ativa IS TRUE",
      { aplicacao }
    );
    if (!aplicacaoId) {
      throw new AppError(
        "Aplicação fornecida não pode utilizar o serviço de autenticação",
        httpCode.BadRequest
      );
    }

    const usuarioDb = await t.oneOrNone(
      "SELECT id, uuid, administrador, senha FROM dgeo.usuario WHERE login = $<usuario> and ativo IS TRUE",
      { usuario }
    );
    if (!usuarioDb) {
      throw new AppError(
        "Usuário não autorizado para utilizar o Serviço de Autenticação",
        httpCode.BadRequest
      );
    }
    var correctPassword = false;
    if (usuario.includes("ldap:")){
      correctPassword = await compareLDAPPassword(senha, usuario.replace("ldap:",""));
    }else{         
      correctPassword = await comparePassword(senha, usuarioDb.senha);
    }
    if (!correctPassword) {
      throw new AppError("Usuário ou senha inválida", httpCode.BadRequest);
    }

    const { id, uuid, administrador } = usuarioDb;

    const token = await signJWT({ id, uuid, administrador }, JWT_SECRET);

    await gravaLogin(id, aplicacaoId.id, t);

    return { token, administrador, uuid };
  });
};

controller.verifyPassword = async (uuid, senha) => {
  const usuarioDb = await db.conn.oneOrNone(
    "SELECT id, uuid, administrador, senha FROM dgeo.usuario WHERE uuid = $<uuid> and ativo IS TRUE",
    { uuid }
  );
  if (!usuarioDb) {
    throw new AppError(
      "Usuário não autorizado para utilizar o Serviço de Autenticação",
      httpCode.BadRequest
    );
  }

  const correctPassword = await comparePassword(senha, usuarioDb.senha);
  if (!correctPassword) {
    throw new AppError("Usuário ou senha inválida", httpCode.BadRequest);
  }
};

module.exports = controller;
