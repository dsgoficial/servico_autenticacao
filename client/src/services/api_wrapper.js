import api from './api'

const apiWrapper = {}

apiWrapper.getDados = async url => {
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

export default apiWrapper