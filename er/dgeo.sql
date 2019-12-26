BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA dgeo;

CREATE TABLE dgeo.usuario(
  id SERIAL NOT NULL PRIMARY KEY,
  login VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  nome_guerra VARCHAR(255) NOT NULL,
  administrador BOOLEAN NOT NULL DEFAULT FALSE,
  ativo BOOLEAN NOT NULL DEFAULT FALSE,
  tipo_turno_id INTEGER NOT NULL REFERENCES dominio.tipo_turno (code),
  tipo_posto_grad_id INTEGER NOT NULL REFERENCES dominio.tipo_posto_grad (code),
  uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
  cpf VARCHAR(255),
  identidade VARCHAR(255),
  validade_identidade VARCHAR(255),
  orgao_expedidor VARCHAR(255),
  banco VARCHAR(255),
  agencia VARCHAR(255),
  conta_bancaria VARCHAR(255),
  data_nascimento VARCHAR(255),
  celular VARCHAR(255),
  email_eb VARCHAR(255) 
);

CREATE TABLE dgeo.login(
  id SERIAL NOT NULL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES dgeo.usuario (id),
  data_login  timestamp with time zone NOT NULL
);

COMMIT;
