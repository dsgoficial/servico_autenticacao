
import { api, auth } from '../services'
import decodeJwt from 'jwt-decode';

const handleLogin = async (usuario, senha) => {
  const response = await api.post('/login', { usuario, senha })
  if (!response) return false

  if (
    !('status' in response) ||
    response.status !== 201 ||
    !('data' in response) ||
    !('dados' in response.data) ||
    !('token' in response.data.dados) ||
    !('administrador' in response.data.dados)
  ) {
    throw new Error('')
  }
  const decodedToken = decodeJwt(response.data.dados.token);
  if (!('uuid' in decodedToken)) {
    throw new Error('')
  }

  auth.setToken(response.data.dados.token)
  auth.setAuthorization(response.data.dados.administrador)
  auth.setUUID(decodedToken.uuid)

  return true
}

export { handleLogin }
