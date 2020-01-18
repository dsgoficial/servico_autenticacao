import { api } from '../services'

const getUsuarios = async () => {
  return api.getData('/api/usuarios/completo')
}

const deletarUsuario = async uuid => {
  return api.delete(`/api/usuarios/${uuid}`)
}

const getSelectData = async () => {
  return api.axiosAll({
    listaPostoGrad: api.getData('/api/usuarios/tipo_posto_grad'),
    listaTurnos: api.getData('/api/usuarios/tipo_turno')
  })
}

const criaUsuario = async (usuario, nome, nomeGuerra, tipoTurnoId, tipoPostoGradId, ativo, administrador) => {
  return api.post('/api/usuarios/completo', {
    usuario,
    nome,
    senha: nome,
    nome_guerra: nomeGuerra,
    tipo_turno_id: tipoTurnoId,
    tipo_posto_grad_id: tipoPostoGradId,
    ativo,
    administrador
  })
}

const atualizaUsuario = async (
  uuid,
  usuario,
  nome,
  nomeGuerra,
  tipoTurnoId,
  tipoPostoGradId,
  administrador,
  ativo
) => {
  return api.put(`/api/usuarios/completo/${uuid}`, {
    usuario,
    nome,
    nome_guerra: nomeGuerra,
    tipo_turno_id: tipoTurnoId,
    tipo_posto_grad_id: tipoPostoGradId,
    administrador,
    ativo
  })
}

export { getUsuarios, deletarUsuario, criaUsuario, atualizaUsuario, getSelectData }
