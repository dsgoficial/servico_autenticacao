import { api, auth } from '../services'

const getData = async () => {
  const uuid = auth.getUUID()

  return api.axiosAll({
    usuario: api.getData(`/api/usuarios/${uuid}`),
    listaPostoGrad: api.getData('/api/usuarios/tipo_posto_grad'),
    listaTurnos: api.getData('/api/usuarios/tipo_turno')
  })
}

const handleUpdate = async (
  nome,
  nomeGuerra,
  tipoPostoGradId,
  tipoTurnoId,
  cpf,
  identidade,
  validadeIdentidade,
  orgaoExpedidor,
  banco,
  agencia,
  contaBancaria,
  dataNascimento,
  celular,
  emailEb
) => {
  const uuid = auth.getUUID()
  return api.put(`/api/usuarios/${uuid}`, {
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
    email_eb: emailEb
  })
}

export { getData, handleUpdate }
