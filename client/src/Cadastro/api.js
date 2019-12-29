import { api } from '../services'

const getData = async () => {
  return api.axiosAll({
    listaPostoGrad: api.getData('/usuarios/tipo_posto_grad'),
    listaTurnos: api.getData('/usuarios/tipo_turno')
  })
}

const handleCadastro = async (usuario, senha, nome, nomeGuerra, tipoTurnoId, tipoPostoGradId) => {
  return api.post('/usuarios', {
    usuario,
    senha,
    nome,
    nome_guerra: nomeGuerra,
    tipo_turno_id: tipoTurnoId,
    tipo_posto_grad_id: tipoPostoGradId
  })
}

export { getData, handleCadastro }