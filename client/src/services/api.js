import axios from 'axios'
import handleAuth from './handle_auth'

const api = axios.create()

api.interceptors.request.use(async config => {
  const token = handleAuth.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
