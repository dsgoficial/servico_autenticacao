import { api } from '../services'

const getData = async () => {
  return api.axiosAll({
    listaTurno: api.getData(`/api/usuarios/tipo_turno`),
    listaPostoGrad: api.getData('/api/usuarios/tipo_posto_grad')
  })
}

const handleCadastro = async (usuario, senha, nome, nomeGuerra, tipoPostoGradId, tipoTurnoId) => {
  return api.post('/api/usuarios', {
    usuario,
    senha,
    nome,
    nome_guerra: nomeGuerra,
    tipo_posto_grad_id: tipoPostoGradId,
    tipo_turno_id: tipoTurnoId,
  })
}

export { getData, handleCadastro }
