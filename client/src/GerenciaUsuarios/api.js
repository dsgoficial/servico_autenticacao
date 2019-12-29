import { api } from '../services'

const getUsuarios = async () => {
  const response = await api.getData('/usuarios/completo')
  if (!response) return false

  if (!('usuarios' in response)) {
    throw new Error()
  }
  return response.usuarios
}

const deletarUsuario = async uuid => {
  return api.delete(`/usuarios/${uuid}`)
}

const getSelectData = async () => {
  return api.axiosAll({
    listaPostoGrad: api.getData('/usuarios/tipo_posto_grad'),
    listaTurnos: api.getData('/usuarios/tipo_turno')
  })
}

const criaUsuario = async uuid => {
}

const atualizaUsuario = async uuid => {
}

export { getUsuarios, deletarUsuario, criaUsuario, atualizaUsuario, getSelectData }