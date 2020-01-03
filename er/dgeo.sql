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
  tipo_turno_id SMALLINT NOT NULL REFERENCES dominio.tipo_turno (code),
  tipo_posto_grad_id SMALLINT NOT NULL REFERENCES dominio.tipo_posto_grad (code),
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
('Sistema de Apoio a Produção - Cliente Web', 'sap_web', TRUE),
('Gerenciador FME - Cliente Web', 'fme_web', TRUE),
('Sistema de Controle do Acervo - Cliente QGIS', 'sca_qgis', TRUE),
('Sistema de Controle do Acervo - Cliente Web', 'sca_web', TRUE),
('Sistema de Controle da Mapoteca - Cliente Web', 'scm_web', TRUE),
('DSGDocs - Cliente Web', 'dsgdocs_web', TRUE),
('SAP Dashboard - Cliente Web', 'sapdashboard_web', TRUE);

CREATE TABLE dgeo.login(
  id SERIAL NOT NULL PRIMARY KEY,
  usuario_id SMALLINT REFERENCES dgeo.usuario (id),
  aplicacao_id SMALLINT REFERENCES dgeo.aplicacao (id),
  data_login  timestamp with time zone NOT NULL
);

COMMIT;
