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

const criaUsuario = async (usuario, nome, nomeGuerra, tipoTurnoId, tipoPostoGradId) => {
  return api.post('/usuarios', {
    usuario,
    nome,
    senha: nome,
    nome_guerra: nomeGuerra,
    tipo_turno_id: tipoTurnoId,
    tipo_posto_grad_id: tipoPostoGradId
  })
}

const atualizaUsuario = async (
  uuid,
  usuario,
  nome,
  nomeGuerra,
  tipoTurnoId,
  tipoPostoGradId,
  cpf,
  identidade,
  validadeIdentidade,
  orgaoExpedidor,
  banco,
  agencia,
  contaBancaria,
  dataNascimento,
  celular,
  emailEb,
  administrador,
  ativo
) => {
  return api.put(`/usuarios/completo/${uuid}`, {
    usuario,
    nome,
    nome_guerra: nomeGuerra,
    tipo_turno_id: tipoTurnoId,
    tipo_posto_grad_id: tipoPostoGradId,
    cpf: cpf,
    identidade: identidade,
    validade_identidade: validadeIdentidade,
    orgao_expedidor: orgaoExpedidor,
    banco: banco,
    agencia: agencia,
    conta_bancaria: contaBancaria,
    data_nascimento: dataNascimento,
    celular: celular,
    email_eb: emailEb,
    ativo,
    administrador
  })
}

export { getUsuarios, deletarUsuario, criaUsuario, atualizaUsuario, getSelectData }
