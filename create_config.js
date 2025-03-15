import fs from 'fs';
import inquirer from 'inquirer';
import colors from 'colors';
import path from 'path';
import promise from 'bluebird';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import pgPromise from 'pg-promise';
import { Command } from 'commander';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

colors.enable();

const program = new Command();

// Initialize pg-promise with Bluebird
const pgp = pgPromise({
  promiseLib: promise
});

/**
 * Reads an SQL file and returns a pg-promise QueryFile
 */
const readSqlFile = file => {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, { minify: true });
};

/**
 * Checks if config.env file exists
 */
const verifyDotEnv = () => {
  return fs.existsSync('./server/config.env');
};

/**
 * Creates config.env file with database credentials and JWT secret
 */
const createDotEnv = (port, dbServer, dbPort, dbName, dbUser, dbPassword) => {
  const secret = crypto.randomBytes(64).toString('hex');

  const env = `PORT=${port}
DB_SERVER=${dbServer}
DB_PORT=${dbPort}
DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
JWT_SECRET=${secret}`;

  fs.writeFileSync('./server/config.env', env);
};

/**
 * Grants necessary database permissions
 */
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
  console.log('Executando permissões...');

  return connection.none(readSqlFile('./er/permissao.sql'), [dbUser]);
};

/**
 * Creates admin user in the authentication service
 */
const createAdminUser = async (login, senha, connection) => {
  const hash = await bcrypt.hash(senha, 10);

  return connection.none(
    `
    INSERT INTO dgeo.usuario (login, senha, nome, nome_guerra, administrador, ativo, tipo_posto_grad_id, tipo_turno_id) VALUES
    ($<login>, $<hash>, $<login>, $<login>, TRUE, TRUE, 13, 3)
  `,
    { login, hash }
  );
};

/**
 * Creates and initializes database for authentication service
 */
const createDatabase = async (
  dbUser,
  dbPassword,
  dbPort,
  dbServer,
  dbName,
  authUser,
  authPassword
) => {
  console.log('Criando Banco...');
  const postgresConnectionString = `postgres://${dbUser}:${dbPassword}@${dbServer}:${dbPort}/postgres`;
  const postgresConn = pgp(postgresConnectionString);
  await postgresConn.none('CREATE DATABASE $1:name', [dbName]);

  const connectionString = `postgres://${dbUser}:${dbPassword}@${dbServer}:${dbPort}/${dbName}`;

  console.log('Executando SQLs...');

  const conn = pgp(connectionString);
  return conn.tx(async t => {
    await t.none(readSqlFile('./er/versao.sql'));
    await t.none(readSqlFile('./er/dominio.sql'));
    await t.none(readSqlFile('./er/dgeo.sql'));
    await givePermission({ dbUser, connection: t });
    await createAdminUser(authUser, authPassword, t);
  });
};

/**
 * Handles errors with user-friendly messages
 */
const handleError = error => {
  if (
    error.message ===
    'Postgres error. Cause: permission denied to create database'
  ) {
    console.log(
      'O usuário informado não é superusuário. Sem permissão para criar bancos de dados.'
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
    error.message.startsWith('Attempted to create a duplicate database')
  ) {
    console.log('O banco já existe.'.red);
  } else if (
    error.message.startsWith('password authentication failed for user')
  ) {
    console.log('Senha inválida para o usuário'.red);
  } else {
    console.log(error.message.red);
    console.log('-------------------------------------------------');
    console.log(error);
  }
  process.exit(0);
};

/**
 * Generate questions for interactive configuration
 */
const getConfigFromUser = options => {
  const questions = [];

  if (!options.dbServer) {
    questions.push({
      type: 'input',
      name: 'dbServer',
      message: 'Qual é o endereço de IP do servidor do banco de dados PostgreSQL?',
      default: 'localhost'
    });
  }
  if (!options.dbPort) {
    questions.push({
      type: 'input',
      name: 'dbPort',
      message: 'Qual é a porta do servidor do banco de dados PostgreSQL?',
      default: 5432
    });
  }
  if (!options.dbUser) {
    questions.push({
      type: 'input',
      name: 'dbUser',
      message: 'Qual é o nome do usuário do PostgreSQL para interação com o Serviço de Autenticação (já existente no banco de dados e ser superusuario)?'
    });
  }
  if (!options.dbPassword) {
    questions.push({
      type: 'password',
      name: 'dbPassword',
      mask: '*',
      message: 'Qual é a senha deste usuário do PostgreSQL?'
    });
  }
  if (!options.dbName) {
    questions.push({
      type: 'input',
      name: 'dbName',
      message: 'Qual é o nome do banco de dados do Serviço de Autenticação?',
      default: 'servico_autenticacao'
    });
  }
  if (!options.port) {
    questions.push({
      type: 'input',
      name: 'port',
      message: 'Em qual porta será executado o Serviço de Autenticação?',
      default: 3010
    });
  }
  if (!options.dbCreate) {
    questions.push({
      type: 'confirm',
      name: 'dbCreate',
      message: 'Deseja criar o banco de dados do Serviço de Autenticação?',
      default: true
    });
  }
  if (!options.authUser) {
    questions.push({
      type: 'input',
      name: 'authUser',
      message: 'Qual é o nome que deseja para o usuário administrador do Serviço de Autenticação?',
      when(answers) {
        return answers.dbCreate;
      }
    });
  }
  if (!options.authPassword) {
    questions.push({
      type: 'password',
      name: 'authPassword',
      mask: '*',
      message:
        'Qual é a senha que deseja para o usuário administrador do Serviço de Autenticação?',
      when(answers) {
        return answers.dbCreate;
      }
    });
    questions.push({
      type: 'password',
      name: 'authPasswordConfirm',
      mask: '*',
      message: 'Confirme a senha para o usuário administrador do Serviço de Autenticação?',
      when(answers) {
        return answers.dbCreate;
      }
    });
    
  }

  return { questions };
};

/**
 * Main configuration function
 */
const createConfig = async (options) => {
  try {
    console.log('Sistema de Autenticação'.blue);
    console.log('Criação do arquivo de configuração e banco de dados'.blue);

    if (!options.overwriteEnv) {
      const exists = verifyDotEnv();
      if (exists) {
        throw new Error(
          'Arquivo config.env já existe, apague antes de iniciar a configuração.'
        );
      }
    }

    let { questions } = getConfigFromUser(options);

    const confirmPassword = [
      {
        type: 'password',
        name: 'authPassword',
        mask: '*',
        message: 'Qual a senha que deseja para o usuário administrador do Serviço de Autenticação?'
      },
      {
        type: 'password',
        name: 'authPasswordConfirm',
        mask: '*',
        message: 'Confirme a senha para o usuário administrador do Serviço de Autenticação?'
      }
    ];
    const validatePassword = async () => {
      console.log(
        'As senhas devem ser as mesmas. Por favor informe novamente.'.red
      );
      let { authPassword, authPasswordConfirm } = await inquirer.prompt(
        confirmPassword
      );
      const check = authPassword === authPasswordConfirm;
  
      if (!check) {
        authPassword = await validatePassword();
      }
      return authPassword;
    };

    const {
      port,
      dbServer,
      dbPort,
      dbName,
      dbUser,
      dbPassword,
      dbCreate,
      authUser,
      authPassword
    } = await inquirer.prompt(questions).then(async userAnswers => {
      const answers = { ...userAnswers, ...options };
      if ("authPassword" in options) {
        answers.authPasswordConfirm = options.authPassword;
      }
      if (
        answers.dbCreate &&
        answers.authPassword !== answers.authPasswordConfirm
      ) {
        answers.authPassword = await validatePassword();
      }
      return answers;
    });


    if (dbCreate) {
      await createDatabase(
        dbUser,
        dbPassword,
        dbPort,
        dbServer,
        dbName,
        authUser,
        authPassword
      );

      console.log(
        'Banco de dados do Serviço de Autenticação criado com sucesso!'.blue
      );
      console.log(
        'O serviço pode ser acessado utilizando o mesmo usuário e senha fornecido.'
          .blue
      );
    } else {
      await givePermission({ dbUser, dbPassword, dbPort, dbServer, dbName });

      console.log(
        `Permissão ao banco de dados adicionada com sucesso ao usuário ${dbUser}`
          .blue
      );
    }

    createDotEnv(port, dbServer, dbPort, dbName, dbUser, dbPassword);

    console.log(
      'Arquivo de configuração (config.env) criado com sucesso!'.blue
    );
  } catch (e) {
    handleError(e);
  }
};

// Configure commander
program
  .option('--db-server <type>', 'Endereço do banco de dados do servidor de autenticação')
  .option('--db-port <type>', 'Porta do banco de dados do servidor de autenticação')
  .option('--db-user <type>', 'Usuário do banco de dados do servidor de autenticação')
  .option('--db-password <type>', 'Senha do banco de dados do servidor de autenticação')
  .option('--db-name <type>', 'Nome do banco de dados do servidor de autenticação')
  .option('--port <type>', 'Porta do serviço de autenticação')
  .option('--db-create', 'Criar banco de dados do serviço de autenticação')
  .option('--no-db-create', 'Não criar banco de dados do serviço de autenticação')
  .option('--auth-user <type>', 'Usuário administrador do serviço de autenticação')
  .option('--auth-password <type>', 'Senha do usuário administrador do serviço de autenticação')
  .option('--overwrite-env', 'Sobrescrever arquivo de configuração');

program.parse(process.argv);
const options = program.opts();
createConfig(options);