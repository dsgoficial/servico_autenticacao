import { auth } from '../services'

const handleLogout = async (history) => {
  auth.logout()
  history.push('/login')
}

export { handleLogout }
