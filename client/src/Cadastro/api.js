import { api, apiWrapper } from '../services'

const getData = async () => {
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

const handleCadastro = async (usuario, senha, nome, nomeGuerra, tipoTurnoId, tipoPostoGradId) => {
  await api.post('/usuarios', {
    usuario,
    senha,
    nome,
    nome_guerra: nomeGuerra,
    tipo_turno_id: tipoTurnoId,
    tipo_posto_grad_id: tipoPostoGradId
  })
}

export { getData, handleCadastro }