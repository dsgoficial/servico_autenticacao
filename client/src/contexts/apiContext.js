import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory } from 'history'
import { useSnackbar } from 'notistack';
import { useAxios } from './axiosContext';

import { APLICACAO, TOKEN_KEY, USER_AUTHORIZATION_KEY, USER_UUID_KEY } from './settings'

const APIContext = createContext('');

const customHistory = createBrowserHistory()


APIProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default function APIProvider({ children }) {

  // variant could be success, error, warning, info, or default
  const { enqueueSnackbar } = useSnackbar();

  const { callAxios } = useAxios()

  const isAuthenticated = () => {
    return window.localStorage.getItem(TOKEN_KEY) !== null &&
      window.localStorage.getItem(USER_UUID_KEY) !== null &&
      window.localStorage.getItem(USER_AUTHORIZATION_KEY) !== null
  }

  const isAdmin = () => {
    return getAuthorization() === 'ADMIN'
  }

  //const getToken = () => window.localStorage.getItem(TOKEN_KEY)

  const setToken = token => window.localStorage.setItem(TOKEN_KEY, token)

  const logout = () => {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_UUID_KEY)
    window.localStorage.removeItem(USER_AUTHORIZATION_KEY)
  }

  const getAuthorization = () => window.localStorage.getItem(USER_AUTHORIZATION_KEY)

  const setAuthorization = admin => {
    admin ? window.localStorage.setItem(USER_AUTHORIZATION_KEY, 'ADMIN') : window.localStorage.setItem(USER_AUTHORIZATION_KEY, 'USER')
  }

  const getUUID = () => window.localStorage.getItem(USER_UUID_KEY)

  const setUUID = uuid => window.localStorage.setItem(USER_UUID_KEY, uuid)

  const handleError = (error) => {
    if ([401, 403].includes(error.response.status)) {
      logout()
      customHistory.go('/login')
    }
  }

  const login = async (usuario, senha) => {
    const response = await callAxios(
      '/api/login',
      "POST",
      { usuario, senha, aplicacao: APLICACAO, cliente: 'sap' }
    );
    if (response.error) {
      enqueueSnackbar('Usuário e Senha não encontrado!', { variant: 'error' });
      return false
    }
    setToken(response.data.dados.token)
    setAuthorization(response.data.dados.administrador)
    setUUID(response.data.dados.uuid)
    return true
  }

  const signUp = async (usuario, senha, nome, nomeGuerra, tipoPostoGradId, tipoTurnoId) => {
    const response = await callAxios(
      '/api/usuarios',
      "POST",
      {
        usuario,
        senha,
        nome,
        nome_guerra: nomeGuerra,
        tipo_posto_grad_id: tipoPostoGradId,
        tipo_turno_id: tipoTurnoId,
      }
    );
    if (response.error) {
      return false
    }
    return true
  }

  const getUserInfo = async () => {
    const uuid = getUUID()
    const response = await callAxios(
      `/api/usuarios/${uuid}`,
      "GET",
      {}
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return {
      nome: response.data.dados.nome,
      nomeGuerra: response.data.dados.nome_guerra,
      tipoPostoGradId: response.data.dados.tipo_posto_grad_id,
      tipoTurnoId: response.data.dados.tipo_turno_id,
    }
  }

  const getRotation = async () => {
    const response = await callAxios(
      '/api/usuarios/tipo_turno',
      "GET",
      {}
    );
    if (response.error) {
      handleError(response.error)
      return []
    }
    return response.data?.dados
  }

  const getPositions = async () => {
    const response = await callAxios(
      '/api/usuarios/tipo_posto_grad',
      "GET",
      {}
    );
    if (response.error) {
      handleError(response.error)
      return []
    }
    return response.data?.dados
  }

  const getUsers = async () => {
    const response = await callAxios(
      '/api/usuarios/completo',
      "GET",
      {}
    );
    if (response.error) {
      handleError(response.error)
      return []
    }
    return response.data?.dados
  }

  const updateUserInfo = async (
    uuid,
    nome,
    nomeGuerra,
    tipoPostoGradId,
    tipoTurnoId,
  ) => {
    const response = await callAxios(
      `/api/usuarios/${uuid}`,
      "PUT",
      {
        nome,
        nome_guerra: nomeGuerra,
        tipo_posto_grad_id: tipoPostoGradId,
        tipo_turno_id: tipoTurnoId,
      }
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const createUser = async (usuario, nome, nomeGuerra, tipoPostoGradId, tipoTurnoId, ativo, administrador, uuid) => {
    const data = {
      usuario,
      nome,
      senha: usuario,
      nome_guerra: nomeGuerra,
      tipo_posto_grad_id: tipoPostoGradId,
      tipo_turno_id: tipoTurnoId,
      ativo,
      administrador
    }

    if (uuid) {
      data.uuid = uuid
    }

    const response = await callAxios(
      '/api/usuarios/completo',
      "POST",
      data
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const deleteUser = async uuid => {
    const response = await callAxios(
      `/api/usuarios/${uuid}`,
      "DELETE",
      {}
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const updateUser = async (
    uuid,
    usuario,
    nome,
    nomeGuerra,
    tipoPostoGradId,
    tipoTurnoId,
    administrador,
    ativo,
    novoUuid
  ) => {
    const response = await callAxios(
      `/api/usuarios/completo/${uuid}`,
      "PUT",
      {
        uuid: novoUuid,
        usuario,
        nome,
        nome_guerra: nomeGuerra,
        tipo_posto_grad_id: tipoPostoGradId,
        tipo_turno_id: tipoTurnoId,
        administrador,
        ativo
      }
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const authorizeUsers = async (uuids, autoriza) => {
    const response = await callAxios(
      `/api/usuarios/autorizacao/${autoriza}`,
      "POST",
      { usuarios_uuids: uuids }
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const resetPasswords = async (uuids) => {
    const response = await callAxios(
      '/api/usuarios/senha/resetar',
      "POST",
      { usuarios_uuids: uuids }
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const updatePasswords = async (uuid, senhaAtual, novaSenha) => {
    const response = await callAxios(
      `/api/usuarios/${uuid}/senha`,
      "PUT",
      {
        senha_atual: senhaAtual,
        senha_nova: novaSenha
      }
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const getApplications = async () => {
    const response = await callAxios(
      '/api/aplicacoes',
      "GET",
      {}
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const updateApplication = async (dados) => {
    const response = await callAxios(
      `/api/aplicacoes/${dados.id}`,
      "PUT",
      dados
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const deleteApplication = async (id) => {
    const response = await callAxios(
      `/api/aplicacoes/${id}`,
      "DELETE",
      {}
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const createApplication = async (dados) => {
    const response = await callAxios(
      '/api/aplicacoes',
      "POST",
      dados
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const getDashboardData = async () => {
    const [
      usuariosLogados,
      usuariosAtivos,
      aplicacoesAtivas,
      loginsPorDia,
      loginsPorMes,
      loginsPorAplicacao,
      loginsPorUsuario
    ] = await Promise.all(
      [
        '/api/dashboard/usuarios_logados',
        '/api/dashboard/usuarios_ativos',
        '/api/dashboard/aplicacoes_ativas',
        '/api/dashboard/logins/dia?total=14',
        '/api/dashboard/logins/mes?total=12',
        '/api/dashboard/logins/aplicacoes?max=14&total=10',
        '/api/dashboard/logins/usuarios?max=14&total=10'
      ].map(async url => {
        const response = await callAxios(
          url,
          "GET",
          {}
        );
        if (response.error) {
          handleError(response.error)
          return []
        }
        return response.data
      })
    )
    return {
      usuariosLogados: usuariosLogados.dados,
      usuariosAtivos: usuariosAtivos.dados,
      aplicacoesAtivas: aplicacoesAtivas.dados,
      loginsPorDia: loginsPorDia.dados,
      loginsPorMes: loginsPorMes.dados,
      loginsPorAplicacao: loginsPorAplicacao.dados,
      loginsPorUsuario: loginsPorUsuario.dados
    }
  }

  const getLDAPUsers = async (
    basedn,
    ldapurl,
  ) => {
    const response = await callAxios(
      `/api/usuarios/getldapusers`,
      "POST",
      {
        basedn: basedn,
        ldapurl: ldapurl,
      }
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const saveLDAPenv = async (
    basedn,
    ldapurl,
  ) => {
    const response = await callAxios(
      `/api/usuarios/saveldapenv`,
      "POST",
      {
        basedn: basedn,
        ldapurl: ldapurl,
      }
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const getLDAPenv = async () => {
    const response = await callAxios(
      `/api/usuarios/getldapenv`,
      "GET",
      {}
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  const upsertLDAPuser = async (usuario, nome, nomeGuerra) => {
    const response = await callAxios(
      `/api/usuarios/upsertldapuser`,
      "POST",
      {
        usuario: usuario,
        nome: nome,
        nomeGuerra: nomeGuerra,
      }
    );
    if (response.error) {
      handleError(response.error)
      return
    }
    return response.data
  }

  return (
    <APIContext.Provider
      value={{
        history: customHistory,
        handleLogin: login,
        logout,
        isAuthenticated,
        getAuthorization,
        isAdmin,
        getUUID,
        getUserInfo,
        getRotation,
        getPositions,
        getUsers,
        createUser,
        deleteUser,
        updateUser,
        authorizeUsers,
        resetPasswords,
        getApplications,
        updateApplication,
        deleteApplication,
        createApplication,
        updateUserInfo,
        updatePasswords,
        getDashboardData,
        signUp,
        getLDAPUsers,
        saveLDAPenv,
        getLDAPenv,
        upsertLDAPuser
      }}>
      {children}
    </APIContext.Provider>
  );
}

export const useAPI = () => useContext(APIContext)