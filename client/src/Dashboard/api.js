import { api } from '../services'

const getDashboardData = async () => {
  return api.axiosAll({
    usuariosLogados: api.getData('/api/dashboard/usuarios_logados'),
    usuariosAtivos: api.getData('/api/dashboard/usuarios_ativos'),
    aplicacoesAtivas: api.getData('/api/dashboard/aplicacoes_ativas'),
    loginsPorDia: api.getData('/api/dashboard/logins/dia?total=14'),
    loginsPorMes: api.getData('/api/dashboard/logins/mes?total=12'),
    loginsPorAplicacao: api.getData('/api/dashboard/logins/aplicacoes?max=14&total=10'),
    loginsPorUsuario: api.getData('/api/dashboard/logins/usuarios?max=14&total=10')
  })
}

export { getDashboardData }
