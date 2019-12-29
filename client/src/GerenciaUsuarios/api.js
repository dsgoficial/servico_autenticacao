import { api } from '../services'

const getUsuarios = async () => {
  const response = await api.getData('/usuarios/completo')
  if (!('usuarios' in response)) {
    throw new Error()
  }
  return response.usuarios
}

export { getUsuarios }