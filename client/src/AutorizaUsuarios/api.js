import { api } from '../services'

const getUsuarios = async () => {
  const usuarios = await api.getData('/api/usuarios/completo')

  return usuarios.filter(u => {
    return !u.administrador
  })
}

const autorizarUsuarios = async (uuids, autoriza) => {
  return api.post(`/api/usuarios/autorizacao/${autoriza}`, { usuarios_uuids: uuids })
}

const resetarSenhas = async (uuids) => {
  return api.post('/api/usuarios/senha/resetar', { usuarios_uuids: uuids })
}

export { getUsuarios, autorizarUsuarios, resetarSenhas }
