import { api } from '../services'

const getAplicacoes = async () => {
  return api.getData('/aplicacoes')
}

const atualizaAplicacao = async (dados) => {
  return api.put(`/aplicacoes/${dados.id}`, dados)
}

const deletaAplicacao = async (id) => {
  return api.delete(`/aplicacoes/${id}`)
}

const criaAplicacao = async (dados) => {
  return api.post('/aplicacoes', dados)
}

export { getAplicacoes, atualizaAplicacao, deletaAplicacao, criaAplicacao }
