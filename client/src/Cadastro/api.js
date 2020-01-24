import { api } from '../services'

const getData = async () => {
  return api.getData('/api/usuarios/tipo_posto_grad')
}

const handleCadastro = async (usuario, senha, nome, nomeGuerra, tipoPostoGradId) => {
  return api.post('/api/usuarios', {
    usuario,
    senha,
    nome,
    nome_guerra: nomeGuerra,
    tipo_posto_grad_id: tipoPostoGradId
  })
}

export { getData, handleCadastro }
