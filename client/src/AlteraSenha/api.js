import { api, auth } from '../services'

const handleUpdate = async (
  senhaAtual,
  senhaNova
) => {
  const uuid = auth.getUUID()
  const response = await api.put(`/usuarios/${uuid}/senha`, {
    senha_atual: senhaAtual,
    senha_nova: senhaNova
  })
  if (response && 'canceled' in response && response.canceled) {
    return false
  }
  return true
}

export { handleUpdate }
