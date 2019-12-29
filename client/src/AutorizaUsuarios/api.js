import { api } from '../services'

const getUsuarios = async () => {
  const response = await api.getData('/usuarios/completo')
  if (!response) return false

  if (!('usuarios' in response)) {
    throw new Error()
  }
  return response.usuarios
}

const autorizarUsuarios = async (uuids) => {
  return api.post('/usuarios/autorizar/true', { usuarios_uuids: uuids })
}

const resetarSenhas = async (uuids) => {
  return api.post('/usuarios/senha/resetar', { usuarios_uuids: uuids })
}

export { getUsuarios, autorizarUsuarios, resetarSenhas }