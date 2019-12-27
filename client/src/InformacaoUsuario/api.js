import { api, auth } from '../services'

const getUserData = async () => {
  const uuid = auth.getUUID()
  return api.getData(`/usuarios/${uuid}`)
}

const getSelectData = async () => {
  return new Promise((resolve, reject) => {
    Promise.all([api.getData('/usuarios/tipo_posto_grad'), api.getData('/usuarios/tipo_turno')]).then(dados => {
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
  await api.axios.put(`/usuarios/${uuid}`, {
    nome,
    nome_guerra: nomeGuerra,
    tipo_turno_id: tipoTurnoId,
    tipo_posto_grad_id: tipoPostoGradId,
    cpf: cpf || '',
    identidade: identidade || '',
    validade_identidade: validadeIdentidade  || '',
    orgao_expedidor: orgaoExpedidor  || '',
    banco: banco || '',
    agencia: agencia || '',
    conta_bancaria: contaBancaria  || '',
    data_nascimento: dataNascimento  || '',
    celular: celular  || '',
    email_eb: emailEb  || ''
  })
}

export { getUserData, getSelectData, handleUpdate }
