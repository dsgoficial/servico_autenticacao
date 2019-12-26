import { handleAuth } from '../services'

const handleLogout = async (history) => {
  handleAuth.logout();
  history.push('/login')
}

export default handleLogout
