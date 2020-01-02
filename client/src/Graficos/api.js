import { api } from '../services'

const getDashboardData = async () => {
  return api.axiosAll({
    usuariosLogados: api.getData('/dashboard/usuarios_logados'),
    usuariosAtivos: api.getData('/dashboard/usuarios_ativos'),
    aplicacoesAtivas: api.getData('/dashboard/aplicacoes_ativas'),
    loginsPorDia: api.getData('/dashboard/logins/dia?total=14'),
    loginsPorMes: api.getData('/dashboard/logins/mes?total=12'),
    loginsPorAplicacao: api.getData('/dashboard/logins/aplicacoes?max=14&total=10'),
    loginsPorUsuario: api.getData('/dashboard/logins/usuarios?max=14&total=10')
  })
}

export { getDashboardData }
