import { api, auth } from '../services'

const handleUpdate = async (
  senhaAtual,
  senhaNova
) => {
  const uuid = auth.getUUID()
  return api.put(`/usuarios/${uuid}/senha`, {
    senha_atual: senhaAtual,
    senha_nova: senhaNova
  })
}

export { handleUpdate }
