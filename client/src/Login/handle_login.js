
import { api, handleAuth } from '../services'

const handleLogin = async (usuario, senha) => {
  const response = await api.post('/login', { usuario, senha })
  if (
    !response ||
    response.status !== 201 ||
    !('data' in response) ||
    !('dados' in response.data) ||
    !('token' in response.data.dados) ||
    !('administrador' in response.data.dados)
  ) {
    throw new Error('')
  }
  handleAuth.setToken(response.data.dados.token)
  handleAuth.setAuthorization(response.data.dados.administrador)
}

export default handleLogin
