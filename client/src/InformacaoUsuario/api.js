import { api, auth } from '../services'

const getData = async () => {
  const uuid = auth.getUUID()

  return api.axiosAll({
    usuario: api.getData(`/api/usuarios/${uuid}`),
    listaPostoGrad: api.getData('/api/usuarios/tipo_posto_grad')
  })
}

const handleUpdate = async (
  nome,
  nomeGuerra,
  tipoPostoGradId
) => {
  const uuid = auth.getUUID()
  return api.put(`/api/usuarios/${uuid}`, {
    nome,
    nome_guerra: nomeGuerra,
    tipo_posto_grad_id: tipoPostoGradId
  })
}

export { getData, handleUpdate }
