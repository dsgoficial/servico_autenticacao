import { api } from '../services'

const getData = async () => {
  return new Promise((resolve, reject) => {
    api.axiosAll([api.getData('/usuarios/tipo_posto_grad'), api.getData('/usuarios/tipo_turno')])
      .then(response => {
        if (response && 'canceled' in response && response.canceled) {
          resolve(false)
        } else {
          api.axiosSpread((listaPostoGrad, listaTurnos) => {
            resolve({
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

const handleCadastro = async (usuario, senha, nome, nomeGuerra, tipoTurnoId, tipoPostoGradId) => {
  const response = await api.post('/usuarios', {
    usuario,
    senha,
    nome,
    nome_guerra: nomeGuerra,
    tipo_turno_id: tipoTurnoId,
    tipo_posto_grad_id: tipoPostoGradId
  })
  if (response && 'canceled' in response && response.canceled) {
    return false
  }
  return true
}

export { getData, handleCadastro }