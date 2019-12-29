import { api, auth } from '../services'

const getData = async () => {
  const uuid = auth.getUUID()
  return new Promise((resolve, reject) => {
    api.axiosAll([api.getData(`/usuarios/${uuid}`), api.getData('/usuarios/tipo_posto_grad'), api.getData('/usuarios/tipo_turno')])
      .then(response => {
        if (response && 'canceled' in response && response.canceled) {
          resolve(false)
        } else {
          api.axiosSpread((usuario, listaPostoGrad, listaTurnos) => {
            resolve({
              usuario,
              listaPostoGrad,
              listaTurnos
            })
          })(response)
        }
      }
      ).catch(e => {
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
  const response = await api.put(`/usuarios/${uuid}`, {
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
  if (response && 'canceled' in response && response.canceled) {
    return false
  }
  return true
}

export { getData, handleUpdate }
