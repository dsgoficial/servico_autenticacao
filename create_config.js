"use strict";

const fs = require("fs");
const inquirer = require("inquirer");
const colors = require("colors"); //colors for console
const pgtools = require("pgtools");
const path = require("path");
const promise = require("bluebird");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const initOptions = {
  promiseLib: promise
};

const pgp = require("pg-promise")(initOptions);

const readSqlFile = file => {
  const fullPath = path.join(__dirname, file);
  return new db.pgp.QueryFile(fullPath, { minify: true });
};

const verifyDotEnv = () => {
  return fs.existsSync("config.env");
};

const createDotEnv = (
  port,
  dbServer,
  dbPort,
  dbName,
  dbUser,
  dbPassword
) => {
  const secret = crypto.randomBytes(64).toString("hex");

  const env = `PORT=${port}
DB_SERVER=${dbServer}
DB_PORT=${dbPort}
DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
JWT_SECRET=${secret}`;

  fs.writeFileSync("config.env", env);
};

const givePermission = async ({
  dbUser,
  dbPassword,
  dbPort,
  dbServer,
  dbName,
  connection
}) => {
  if (!connection) {
    const connectionString = `postgres://${dbUser}:${dbPassword}@${dbServer}:${dbPort}/${dbName}`;
  
    connection = pgp(connectionString);
  }
  await connection.none(readSqlFile("./er/permissao.sql"), [dbUser]);
};

const createAdminUser = async (login, senha, connection) => {
  const hash = await bcrypt.hash(senha, 10);

  return await connection.none(
    `
    INSERT INTO dgeo.usuario (login, senha, nome, nome_guerra, administrador, ativo, tipo_turno_id, tipo_posto_grad_id) VALUES
    ($<login>, $<hash>, $<login>, $<login>, TRUE, TRUE, 3, 13)
  `,
    {login, hash}
  );
};

const createDatabase = async (dbUser, dbPassword, dbPort, dbServer, dbName) => {
  const config = {
    user: dbUser,
    password: dbPassword,
    port: dbPort,
    host: dbServer
  };

  await pgtools.createdb(config, dbName);

  const connectionString = `postgres://${dbUser}:${dbPassword}@${dbServer}:${dbPort}/${dbName}`;

  const db = pgp(connectionString);
  await db.conn.tx(async t => {
    await t.none(readSqlFile("./er/version.sql"));
    await t.none(readSqlFile("./er/dominio.sql"));
    await t.none(readSqlFile("./er/dgeo.sql"));
    await givePermission({ dbUser, connection: t });
    await createAdminUser(dbUser, dbPassword, t);
  });
};

const handleError = error => {
  if (
    error.message ===
    "Postgres error. Cause: permission denied to create database"
  ) {
    console.log(
      "O usuário informado não é superusuário. Sem permissão para criar bancos de dados."
        .red
    );
  } else if (
    error.message === 'permission denied to create extension "postgis"'
  ) {
    console.log(
      "O usuário informado não é superusuário. Sem permissão para criar a extensão 'postgis'. Delete o banco de dados criado antes de executar a configuração novamente."
        .red
    );
  } else if (
    error.message.startsWith("Attempted to create a duplicate database")
  ) {
    console.log(`O banco já existe.`.red);
  } else if (
    error.message.startsWith("password authentication failed for user")
  ) {
    console.log(`Senha inválida para o usuário`.red);
  } else {
    console.log(error.message.red);
    console.log("-------------------------------------------------");
    console.log(error);
  }
  process.exit(0);
};

const createConfig = async () => {
  try {
    console.log("Sistema de Autenticação".blue);
    console.log("Criação do arquivo de configuração e banco de dados".blue);

    const exists = verifyDotEnv();
    if (exists) {
      throw new Error(
        "Arquivo config.env já existe, apague antes de iniciar a configuração."
      );
    }

    const questions = [
      {
        type: "input",
        name: "dbServer",
        message:
          "Qual o endereço de IP do servidor do banco de dados PostgreSQL?"
      },
      {
        type: "input",
        name: "dbPort",
        message: "Qual a porta do servidor do banco de dados PostgreSQL?",
        default: 5432
      },
      {
        type: "input",
        name: "dbUser",
        message:
          "Qual o nome do usuário do PostgreSQL para interação com o Serviço de Autenticação (já existente no banco de dados e ser superusuario)?",
        default: "controle_app"
      },
      {
        type: "password",
        name: "dbPassword",
        message:
          "Qual a senha do usuário do PostgreSQL para interação com o Serviço de Autenticação ?"
      },
      {
        type: "input",
        name: "dbName",
        message: "Qual o nome do banco de dados do Serviço de Autenticação ?",
        default: "servico_autenticacao"
      },
      {
        type: "input",
        name: "port",
        message: "Qual a porta do serviço do Serviço de Autenticação ?",
        default: 3012
      },
      {
        type: "confirm",
        name: "dbCreate",
        message: "Deseja criar o banco de dados do Serviço de Autenticação ?",
        default: true
      }
    ];

    const {
      port,
      dbServer,
      dbPort,
      dbName,
      dbUser,
      dbPassword,
      dbCreate
    } = await inquirer.prompt(questions);

    if (dbCreate) {
      await createDatabase(dbUser, dbPassword, dbPort, dbServer, dbName);

      console.log("Banco de dados do Serviço de Autenticação criado com sucesso!".blue);
      console.log("O serviço pode ser acesso utilizando o mesmo usuário e senha fornecido.".blue);

    } else {
      await givePermission({ dbUser, dbPassword, dbPort, dbServer, dbName });

      console.log(`Permissão ao banco de dados adicionada com sucesso ao usuário ${dbUser}`.blue);
    }

    createDotEnv(
      port,
      dbServer,
      dbPort,
      dbName,
      dbUser,
      dbPassword
    );

    console.log(
      "Arquivo de configuração (config.env) criado com sucesso!".blue
    );
  } catch (e) {
    handleError(e);
  }
};

createConfig();
