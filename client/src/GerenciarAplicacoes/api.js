import { api } from '../services'

const getAplicacoes = async () => {
  return api.getData('/api/aplicacoes')
}

const atualizaAplicacao = async (dados) => {
  return api.put(`/api/aplicacoes/${dados.id}`, dados)
}

const deletaAplicacao = async (id) => {
  return api.delete(`/api/aplicacoes/${id}`)
}

const criaAplicacao = async (dados) => {
  return api.post('/api/aplicacoes', dados)
}

export { getAplicacoes, atualizaAplicacao, deletaAplicacao, criaAplicacao }
