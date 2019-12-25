import { api } from '../services'

const getFromApi = async url => {
  const response = await api.get(url)
  if (
    !response ||
    response.status !== 200 ||
    !('data' in response) ||
    !('dados' in response.data)
  ) {
    throw new Error()
  }
  return response.data.dados
}

const getData = async () => {
  return new Promise((resolve, reject) => {
    Promise.all([getFromApi('/usuarios/tipo_posto_grad'), getFromApi('/usuarios/tipo_turno')]).then(dados => {
      resolve({
        listaPostoGrad: dados[0],
        listaTurnos: dados[1]
      })
    }).catch(e => {
      reject(e)
    })
  })
}

export default getData
