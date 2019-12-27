import axios from 'axios'
import auth from './auth'

const axiosInstance = axios.create()

axiosInstance.defaults.headers.common['Content-Type'] = "application/json";

axiosInstance.interceptors.request.use(async config => {
  const token = auth.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const errorHandler = error => {
  if ([401, 403].indexOf(error.response.status) !== -1) {
    auth.logout()
    return
  }
  return Promise.reject(error)
}

axiosInstance.interceptors.response.use(
  response => response,
  error => errorHandler(error)
)

const api = {}

api.axios = axiosInstance

api.getData = async url => {
  const response = await api.axios.get(url)
  if (
    !response ||
    response.status !== 200 ||
    !('data' in response) ||
    !('dados' in response.data)
  ) {
    throw new Error()
  }
  return response.data.dados
}

export default api


