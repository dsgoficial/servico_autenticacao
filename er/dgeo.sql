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
  tipo_posto_grad_id SMALLINT NOT NULL REFERENCES dominio.tipo_posto_grad (code),
  tipo_turno_id SMALLINT NOT NULL REFERENCES dominio.tipo_turno (code),
  uuid UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE dgeo.aplicacao(
  id SERIAL NOT NULL PRIMARY KEY,
  nome VARCHAR(255) UNIQUE NOT NULL,
  nome_abrev VARCHAR(255) UNIQUE NOT NULL,
  ativa BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO dgeo.aplicacao (nome, nome_abrev, ativa) VALUES
('Serviço Autenticação - Cliente Web', 'auth_web', TRUE),
('Sistema de Apoio a Produção - Ferramentas de Produção', 'sap_fp', TRUE),
('Sistema de Apoio a Produção - Ferramentas de Gerëncia', 'sap_fg', TRUE),
('Gerenciador FME - Cliente Web', 'fme_web', TRUE),
('SAP Dashboard - Cliente Web', 'sapdashboard_web', TRUE);

CREATE TABLE dgeo.login(
  id SERIAL NOT NULL PRIMARY KEY,
  usuario_id SMALLINT REFERENCES dgeo.usuario (id),
  aplicacao_id SMALLINT REFERENCES dgeo.aplicacao (id),
  data_login  timestamp with time zone NOT NULL
);

COMMIT;
