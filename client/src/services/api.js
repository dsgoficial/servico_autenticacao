import axios from 'axios'
import auth from './auth'

const api = axios.create()

api.interceptors.request.use(async config => {
  const token = auth.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api


