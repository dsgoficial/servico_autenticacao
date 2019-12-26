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

const handleResponse = response => {
  return response.text().then(text => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        auth.logout()
        window.location.reload(true)
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}

export default api


