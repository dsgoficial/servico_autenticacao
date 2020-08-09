"use strict";

const { db } = require("../database");

const controller = {};

controller.getUsuariosLogados = async () => {
  return db.conn.any(
    `SELECT ROW_NUMBER () OVER (ORDER BY l.ultimo_login DESC) AS id,
    l.ultimo_login, u.login, u.nome_guerra, tpg.nome_abrev AS tipo_posto_grad, tt.nome AS tipo_turno, a.nome_abrev AS aplicacao
    FROM dgeo.usuario AS u
    INNER JOIN dominio.tipo_posto_grad AS tpg ON tpg.code = u.tipo_posto_grad_id
    INNER JOIN dominio.tipo_turno AS tt ON tt.code = u.tipo_turno_id
    INNER JOIN 
    (SELECT aplicacao_id, usuario_id, max(data_login) AS ultimo_login FROM dgeo.login GROUP BY usuario_id, aplicacao_id) AS l
    ON l.usuario_id = u.id
    INNER JOIN dgeo.aplicacao AS a ON a.id = l.aplicacao_id
    WHERE l.ultimo_login::date = now()::date
    ORDER BY l.ultimo_login DESC`
  );
};

controller.getUsuariosAtivos = async () => {
  const result = await db.conn.one(
    "SELECT count(*) FROM dgeo.usuario WHERE ativo IS TRUE"
  );

  return result.count;
};

controller.getAplicacoesAtivas = async () => {
  const result = await db.conn.one(
    "SELECT count(*) FROM dgeo.aplicacao WHERE ativa IS TRUE"
  );

  return result.count;
};

controller.getLoginsDia = async (total = 14) => {
  const result = await db.conn.any(
    `SELECT day::date AS data_login,count(l.id) AS logins FROM 
    generate_series((now() - interval '$<total:raw> day')::date, now()::date, interval  '1 day') AS day
    LEFT JOIN dgeo.login AS l ON l.data_login::date = day.day::date
    GROUP BY day::date
    ORDER BY day::date
    `,
    { total: total - 1 }
  );
  result.forEach((r) => {
    r.logins = +r.logins;
  });

  return result;
};

controller.getLoginsMes = async (total = 12) => {
  const result = await db.conn.any(
    `SELECT date_trunc('month', month.month)::date AS data_login, count(l.id) AS logins FROM 
    generate_series(date_trunc('month', (date_trunc('month', now()) - interval '$<total:raw> months'))::date, date_trunc('month', now())::date, interval  '1 month') AS month
    LEFT JOIN dgeo.login AS l ON date_trunc('month', l.data_login) = date_trunc('month', month.month)
    GROUP BY date_trunc('month', month.month)
    ORDER BY date_trunc('month', month.month)
    `,
    { total: total - 1 }
  );

  result.forEach((r) => {
    r.logins = +r.logins;
  });

  return result;
};

controller.getLoginsAplicacoes = async (total = 14, max = 10) => {
  const aplicacoes = await db.conn.any(
    `SELECT COALESCE(a.nome_abrev, 'Aplicação deletada') AS aplicacao, count(l.id) AS logins 
    FROM dgeo.login AS l
    LEFT JOIN dgeo.aplicacao AS a ON a.id = l.aplicacao_id
    WHERE l.data_login::date >= (now() - interval '$<total:raw> day')::date
    GROUP BY a.nome_abrev
    ORDER BY count(l.id) DESC
    LIMIT $<max:raw>`,
    { total: total - 1, max: max - 1 }
  );
  const dados = await db.conn.any(
    `SELECT day::date AS data_login,  COALESCE(a.nome_abrev, 'Aplicação deletada') AS aplicacao, count(l.id) AS logins FROM 
    generate_series((now() - interval '$<total:raw> day')::date, now()::date, interval  '1 day') AS day
    LEFT JOIN dgeo.login AS l ON l.data_login::date = day.day::date
    LEFT JOIN dgeo.aplicacao AS a ON a.id = l.aplicacao_id
    GROUP BY day::date, a.nome_abrev
    ORDER BY day::date, a.nome_abrev`,
    { total: total - 1 }
  );

  const aplicacoesFixed = [];
  aplicacoes.forEach((a) => aplicacoesFixed.push(a.aplicacao));

  const resultDict = {};
  dados.forEach((d) => {
    if (!(d.data_login in resultDict)) {
      resultDict[d.data_login] = {};
      resultDict[d.data_login].data = d.data_login.toISOString().split("T")[0];
      aplicacoesFixed.forEach((a) => {
        resultDict[d.data_login][a] = 0;
      });
      resultDict[d.data_login].outros = 0;
    }
    if (aplicacoesFixed.indexOf(d.aplicacao) !== -1) {
      resultDict[d.data_login][d.aplicacao] = +d.logins;
    } else {
      resultDict[d.data_login].outros += d.logins;
    }
  });

  const result = [];
  Object.keys(resultDict).forEach((key) => {
    result.push(resultDict[key]);
  });

  return result;
};

controller.getLoginsUsuarios = async (total = 14, max = 10) => {
  const usuarios = await db.conn.any(
    `SELECT COALESCE(pg.nome_abrev || ' ' || u.nome_guerra, 'Usuário deletado') AS usuario, count(l.id) AS logins 
    FROM dgeo.login AS l
    LEFT JOIN dgeo.usuario AS u ON u.id = l.usuario_id
    LEFT JOIN dominio.tipo_posto_grad AS pg ON pg.code = u.tipo_posto_grad_id
    WHERE l.data_login::date >= (now() - interval '$<total:raw> day')::date
    GROUP BY pg.nome_abrev || ' ' || u.nome_guerra
    ORDER BY count(l.id) DESC
    LIMIT $<max:raw>`,
    { total: total - 1, max: max - 1 }
  );
  const dados = await db.conn.any(
    `SELECT day::date AS data_login,  COALESCE(pg.nome_abrev || ' ' || u.nome_guerra, 'Usuário deletado') AS usuario, count(l.id) AS logins FROM 
    generate_series((now() - interval '$<total:raw> day')::date, now()::date, interval  '1 day') AS day
    LEFT JOIN dgeo.login AS l ON l.data_login::date = day.day::date
    LEFT JOIN dgeo.usuario AS u ON u.id = l.usuario_id
    LEFT JOIN dominio.tipo_posto_grad AS pg ON pg.code = u.tipo_posto_grad_id
    GROUP BY day::date, pg.nome_abrev || ' ' || u.nome_guerra
    ORDER BY day::date, pg.nome_abrev || ' ' || u.nome_guerra`,
    { total: total - 1 }
  );

  const usuariosFixed = [];
  usuarios.forEach((a) => usuariosFixed.push(a.usuario));

  const resultDict = {};
  dados.forEach((d) => {
    if (!(d.data_login in resultDict)) {
      resultDict[d.data_login] = {};
      resultDict[d.data_login].data = d.data_login.toISOString().split("T")[0];
      usuariosFixed.forEach((u) => {
        resultDict[d.data_login][u] = 0;
      });
      resultDict[d.data_login].outros = 0;
    }
    if (usuariosFixed.indexOf(d.usuario) !== -1) {
      resultDict[d.data_login][d.usuario] = +d.logins;
    } else {
      resultDict[d.data_login].outros += d.logins;
    }
  });

  const result = [];
  Object.keys(resultDict).forEach((key) => {
    result.push(resultDict[key]);
  });

  return result;
};

module.exports = controller;
