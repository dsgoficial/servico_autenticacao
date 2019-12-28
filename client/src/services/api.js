import axios from 'axios'
import auth from './auth'
import history from './history';

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
    history.push('/')
    throw new axios.Cancel('Operation canceled by redirect due 401/403.')
  }
  if ([500].indexOf(error.response.status) !== -1) {
    history.push('/erro')
    throw new axios.Cancel('Operation canceled by redirect due 500.')
  }
  return Promise.reject(error)
}

axiosInstance.interceptors.response.use(
  response => response,
  error => errorHandler(error)
)

const api = {}

api.axiosSpread = axios.spread

api.axiosAll = async params => {
  try {
    const response = await axios.all(params)
    return response
  } catch (err) {
    if (!axios.isCancel(err)) {
      throw err
    }
    return { canceled: true }
  }
}

api.post = async (url, params) => {
  try {
    const response = await axiosInstance.post(url, params)
    return response
  } catch (err) {
    if (!axios.isCancel(err)) {
      throw err
    }
    return { canceled: true }
  }
}

api.get = async (url, params) => {
  try {
    const response = await axiosInstance.get(url, params)
    return response
  } catch (err) {
    if (!axios.isCancel(err)) {
      throw err
    }
    return { canceled: true }
  }
}


api.put = async (url, params) => {
  try {
    const response = await axiosInstance.put(url, params)
    return response
  } catch (err) {
    if (!axios.isCancel(err)) {
      throw err
    }
    return { canceled: true }
  }
}

api.delete = async (url, params) => {
  try {
    const response = await axiosInstance.delete(url, params)
    return response
  } catch (err) {
    if (!axios.isCancel(err)) {
      throw err
    }
    return { canceled: true }
  }
}

api.getData = async url => {
  const response = await axiosInstance.get(url)
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


