import { api, apiWrapper, auth } from '../services'

const getUserData = async () => {
  const uuid = auth.getUUID()
  return apiWrapper.getData(`/usuarios/${uuid}`)
}

const getSelectData = async () => {
  return new Promise((resolve, reject) => {
    Promise.all([apiWrapper.getData('/usuarios/tipo_posto_grad'), apiWrapper.getData('/usuarios/tipo_turno')]).then(dados => {
      resolve({
        listaPostoGrad: dados[0],
        listaTurnos: dados[1]
      })
    }).catch(e => {
      reject(e)
    })
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
  await api.put(`/usuarios/${uuid}`, {
    nome,
    nome_guerra: nomeGuerra,
    tipo_turno_id: tipoTurnoId,
    tipo_posto_grad_id: tipoPostoGradId,
    cpf,
    identidade,
    validade_identidade: validadeIdentidade,
    orgao_expedidor: orgaoExpedidor,
    banco,
    agencia,
    conta_bancaria: contaBancaria,
    data_nascimento: dataNascimento,
    celular,
    email_eb: emailEb
  })
}

export { getUserData, getSelectData, handleUpdate }
