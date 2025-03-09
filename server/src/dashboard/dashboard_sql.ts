// Path: dashboard\dashboard_sql.ts
export const SQL = {
  GET_USUARIOS_LOGADOS: `
    SELECT ROW_NUMBER () OVER (ORDER BY l.ultimo_login DESC) AS id,
    l.ultimo_login, u.login, u.nome_guerra, tpg.nome_abrev AS tipo_posto_grad, tt.nome AS tipo_turno, a.nome_abrev AS aplicacao
    FROM dgeo.usuario AS u
    INNER JOIN dominio.tipo_posto_grad AS tpg ON tpg.code = u.tipo_posto_grad_id
    INNER JOIN dominio.tipo_turno AS tt ON tt.code = u.tipo_turno_id
    INNER JOIN 
    (SELECT aplicacao_id, usuario_id, max(data_login) AS ultimo_login FROM dgeo.login GROUP BY usuario_id, aplicacao_id) AS l
    ON l.usuario_id = u.id
    INNER JOIN dgeo.aplicacao AS a ON a.id = l.aplicacao_id
    WHERE l.ultimo_login::date = now()::date
    ORDER BY l.ultimo_login DESC
  `,

  GET_USUARIOS_ATIVOS: `
    SELECT count(*)::integer AS count FROM dgeo.usuario WHERE ativo IS TRUE
  `,

  GET_APLICACOES_ATIVAS: `
    SELECT count(*)::integer AS count FROM dgeo.aplicacao WHERE ativa IS TRUE
  `,

  GET_LOGINS_DIA: `
    SELECT day::date AS data_login, count(l.id) AS logins FROM 
    generate_series((now() - interval '$<total:raw> day')::date, now()::date, interval '1 day') AS day
    LEFT JOIN dgeo.login AS l ON l.data_login::date = day.day::date
    GROUP BY day::date
    ORDER BY day::date
  `,

  GET_LOGINS_MES: `
    SELECT date_trunc('month', month.month)::date AS data_login, count(l.id) AS logins FROM 
    generate_series(date_trunc('month', (date_trunc('month', now()) - interval '$<total:raw> months'))::date, date_trunc('month', now())::date, interval '1 month') AS month
    LEFT JOIN dgeo.login AS l ON date_trunc('month', l.data_login) = date_trunc('month', month.month)
    GROUP BY date_trunc('month', month.month)
    ORDER BY date_trunc('month', month.month)
  `,

  GET_APLICACOES_WITH_LOGINS: `
    SELECT COALESCE(a.nome_abrev, 'Aplicação deletada') AS aplicacao, count(l.id) AS logins 
    FROM dgeo.login AS l
    LEFT JOIN dgeo.aplicacao AS a ON a.id = l.aplicacao_id
    WHERE l.data_login::date >= (now() - interval '$<total:raw> day')::date
    GROUP BY a.nome_abrev
    ORDER BY count(l.id) DESC
    LIMIT $<max:raw>
  `,

  GET_LOGINS_APLICACOES_BY_DAY: `
    SELECT day::date AS data_login, COALESCE(a.nome_abrev, 'Aplicação deletada') AS aplicacao, count(l.id) AS logins FROM 
    generate_series((now() - interval '$<total:raw> day')::date, now()::date, interval '1 day') AS day
    LEFT JOIN dgeo.login AS l ON l.data_login::date = day.day::date
    LEFT JOIN dgeo.aplicacao AS a ON a.id = l.aplicacao_id
    GROUP BY day::date, a.nome_abrev
    ORDER BY day::date, a.nome_abrev
  `,

  GET_USUARIOS_WITH_LOGINS: `
    SELECT COALESCE(pg.nome_abrev || ' ' || u.nome_guerra, 'Usuário deletado') AS usuario, count(l.id) AS logins 
    FROM dgeo.login AS l
    LEFT JOIN dgeo.usuario AS u ON u.id = l.usuario_id
    LEFT JOIN dominio.tipo_posto_grad AS pg ON pg.code = u.tipo_posto_grad_id
    WHERE l.data_login::date >= (now() - interval '$<total:raw> day')::date
    GROUP BY pg.nome_abrev || ' ' || u.nome_guerra
    ORDER BY count(l.id) DESC
    LIMIT $<max:raw>
  `,

  GET_LOGINS_USUARIOS_BY_DAY: `
    SELECT day::date AS data_login, COALESCE(pg.nome_abrev || ' ' || u.nome_guerra, 'Usuário deletado') AS usuario, count(l.id) AS logins FROM 
    generate_series((now() - interval '$<total:raw> day')::date, now()::date, interval '1 day') AS day
    LEFT JOIN dgeo.login AS l ON l.data_login::date = day.day::date
    LEFT JOIN dgeo.usuario AS u ON u.id = l.usuario_id
    LEFT JOIN dominio.tipo_posto_grad AS pg ON pg.code = u.tipo_posto_grad_id
    GROUP BY day::date, pg.nome_abrev || ' ' || u.nome_guerra
    ORDER BY day::date, pg.nome_abrev || ' ' || u.nome_guerra
  `,
};
