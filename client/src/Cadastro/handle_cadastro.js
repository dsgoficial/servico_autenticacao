import { api } from '../services'

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

export default handleCadastro
