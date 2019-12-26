import { api, apiWrapper, auth } from '../services'

const getData = async () => {
  const uuid = auth.getUUID()
  return apiWrapper.getData(`/usuarios/${uuid}`)
}

const handleUpdate = async (
  nome,
  nomeGuerra,
  tipoTurnoId,
  tipoTurnoId,
  cpf,
  identidade,
  validadeIdentidade,
  orgaoExpeditor,
  banco,
  agencia,
  contaBancaria,
  dataNascimento,
  celular,
  emailEb
) => {
  const uuid = auth.getUUID()
  await api.put(`/usuarios/${uuid}`, {
    nome,
    nome_guerra: nomeGuerra,
    tipo_turno_id: tipoTurnoId,
    tipo_posto_grad_id: tipoPostoGradId,
    cpf,
    identidade,
    validade_identidade: validadeIdentidade,
    orgao_expeditor: orgaoExpeditor,
    banco,
    agencia,
    conta_bancaria: contaBancaria,
    data_nascimento: dataNascimento,
    celular,
    email_eb: emailEb
  })
}

export { getData, handleUpdate }
