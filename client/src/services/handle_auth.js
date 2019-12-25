const TOKEN_KEY = '@authserver-Token'

const AUTH_KEY = '@authserver-Role'

const handleAuth = {}

handleAuth.isAuthenticated = () => window.localStorage.getItem(TOKEN_KEY) !== null

handleAuth.getToken = () => window.localStorage.getItem(TOKEN_KEY)

handleAuth.setToken = token => window.localStorage.setItem(TOKEN_KEY, token)

handleAuth.logout = () => {
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(AUTH_KEY)
}

handleAuth.setAuthorization = (admin) => {
  admin ? window.localStorage.setItem(AUTH_KEY, 'ADMIN') : window.localStorage.setItem(AUTH_KEY, 'USER')
}

handleAuth.getAuthorization = (admin) => window.localStorage.getItem(AUTH_KEY)

export default handleAuth
