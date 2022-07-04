import { useState, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory } from 'history'
import axios from 'axios'

//axios.defaults.baseURL = process.env.REACT_APP_BE_URL;

const APLICACAO = 'auth_web'

const APIContext = createContext('');

const customHistory = createBrowserHistory()

const TOKEN_KEY = '@authserver-Token'

const USER_AUTHORIZATION_KEY = '@authserver-User-Authorization'

const USER_UUID_KEY = '@authserver-User-uuid'

const ROLES = {
  Admin: 'ADMIN',
  User: 'USER'
}

APIProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default function APIProvider({ children }) {

  const axiosInstance = axios.create()

  axiosInstance.defaults.headers.common['Content-Type'] = 'application/json'

  axiosInstance.interceptors.response.use(
    response => response,
    error => errorHandler(error)
  )

  axiosInstance.interceptors.request.use(async config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  const isAuthenticated = () => {
    return window.localStorage.getItem(TOKEN_KEY) !== null &&
      window.localStorage.getItem(USER_UUID_KEY) !== null &&
      window.localStorage.getItem(USER_AUTHORIZATION_KEY) !== null
  }

  const isAdmin = () => {
    return getAuthorization() == 'ADMIN'
  }

  const getToken = () => window.localStorage.getItem(TOKEN_KEY)

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

  const axiosAll = async requestsObject => {
    const requestsName = []
    const requests = []
    let index = 0
    for (const key in requestsObject) {
      requestsName[index] = key
      requests[index] = requestsObject[key]
      index++
    }

    return new Promise((resolve, reject) => {
      axios.all(requests)
        .then(response => {
          let cancelled = false
          response.forEach(r => {
            if (!r) {
              cancelled = true
            }
          })
          if (cancelled) {
            return resolve(false)
          }

          const responseObject = {}
          response.forEach((r, i) => {
            responseObject[requestsName[i]] = r
          })

          return resolve(responseObject)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  const handleCancel = func => {
    return async function (url, params) {
      try {
        const response = await axiosInstance[func](url, params)
        return response
      } catch (err) {
        if (!axios.isCancel(err)) {
          throw err
        }
        return false
      }
    }
  }

  const getData = async (url, params) => {
    const response = await handleCancel('get')(
      url,
      params
    )
    if (!response) return false
    if (
      !('status' in response) ||
      response.status !== 200 ||
      !('data' in response) ||
      !('dados' in response.data)
    ) {
      throw new Error()
    }
    return response.data
  }

  const postData = async (url, params) => {
    const response = await handleCancel('post')(
      url,
      params
    )
    if (!response) return false
    return response
  }

  const putData = async (url, params) => {
    const response = await handleCancel('put')(
      url,
      params
    )
    if (!response) return false
    return response
  }

  const deleteData = async (url, params) => {
    const response = await handleCancel('delete')(
      url,
      params
    )
    if (!response) return false
    return response
  }

  const handleLogin = async (usuario, senha) => {
    const response = await handleCancel('post')('/api/login', { usuario, senha, aplicacao: APLICACAO, cliente: 'sap' })
    if (!response) return false
    console.log(response)
    if (
      !('status' in response) ||
      response.status !== 201 ||
      !('data' in response) ||
      !('dados' in response.data) ||
      !('token' in response.data.dados) ||
      !('administrador' in response.data.dados)
    ) {
      throw new Error()
    }
    setToken(response.data.dados.token)
    setAuthorization(response.data.dados.administrador)
    setUUID(response.data.dados.uuid)
    return true
  }

  const errorHandler = error => {
    console.log(error.response.status)
    if (error.response && [401, 403].indexOf(error.response.status) !== -1) {
      logout()
      customHistory.push('/')
      throw new axios.Cancel('Operation canceled by redirect due 401/403.')
    }
    if (error.response && [500].indexOf(error.response.status) !== -1) {
      customHistory.push('/erro')
      throw new axios.Cancel('Operation canceled by redirect due 500.')
    }
    return Promise.reject(error)
  }

  const handleApiError = (err) => {
    if (
      'response' in err &&
      'data' in err.response &&
      'message' in err.response.data
    ) {
      return { status: 'error', msg: err.response.data.message, date: new Date() }
    } else {
      return { status: 'error', msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() }
    }
  }

  const getUsuarioInfo = async () => {
    const uuid = getUUID()
    const usuario = await getData(`/api/usuarios/${uuid}`)
    return {
      nome: usuario.dados.nome,
      nomeGuerra: usuario.dados.nome_guerra,
      tipoPostoGradId: usuario.dados.tipo_posto_grad_id,
      tipoTurnoId: usuario.dados.tipo_turno_id,
    }
  }

  const getTurnos = async () => {
    const res = await getData('/api/usuarios/tipo_turno')
    return res.dados
  }

  const getPostos = async () => {
    const res = await getData('/api/usuarios/tipo_posto_grad')
    return res.dados
  }

  const getUsuarios = async () => {
    const res = await getData('/api/usuarios/completo')
    return res.dados
  }

  const atualizaUsuarioInfo = async (
    uuid,
    nome,
    nomeGuerra,
    tipoPostoGradId,
    tipoTurnoId,
  ) => {
    return putData(`/api/usuarios/${uuid}`, {
      nome,
      nome_guerra: nomeGuerra,
      tipo_posto_grad_id: tipoPostoGradId,
      tipo_turno_id: tipoTurnoId,
    })
  }

  const criaUsuario = async (usuario, nome, nomeGuerra, tipoPostoGradId, tipoTurnoId, ativo, administrador, uuid) => {
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

    return postData('/api/usuarios/completo', data)
  }

  const deletarUsuario = async uuid => {
    return deleteData(`/api/usuarios/${uuid}`)
  }

  const atualizaUsuario = async (
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
    return putData(`/api/usuarios/completo/${uuid}`, {
      uuid: novoUuid,
      usuario,
      nome,
      nome_guerra: nomeGuerra,
      tipo_posto_grad_id: tipoPostoGradId,
      tipo_turno_id: tipoTurnoId,
      administrador,
      ativo
    })
  }

  const autorizarUsuarios = async (uuids, autoriza) => {
    return postData(`/api/usuarios/autorizacao/${autoriza}`, { usuarios_uuids: uuids })
  }

  const resetarSenhas = async (uuids) => {
    return postData('/api/usuarios/senha/resetar', { usuarios_uuids: uuids })
  }

  const atualizarSenhas = async (uuid, senhaAtual, novaSenha) => {
    return await putData(
      `/api/usuarios/${uuid}/senha`,
      {
        senha_atual: senhaAtual,
        senha_nova: novaSenha
      }
    )
  }

  const getAplicacoes = async () => {
    const res = await getData('/api/aplicacoes')
    return res.dados
  }

  const atualizaAplicacao = async (dados) => {
    return putData(`/api/aplicacoes/${dados.id}`, dados)
  }

  const deletaAplicacao = async (id) => {
    return deleteData(`/api/aplicacoes/${id}`)
  }

  const criaAplicacao = async (dados) => {
    return postData('/api/aplicacoes', dados)
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
    ] = await Promise.all([
      getData('/api/dashboard/usuarios_logados'),
      getData('/api/dashboard/usuarios_ativos'),
      getData('/api/dashboard/aplicacoes_ativas'),
      getData('/api/dashboard/logins/dia?total=14'),
      getData('/api/dashboard/logins/mes?total=12'),
      getData('/api/dashboard/logins/aplicacoes?max=14&total=10'),
      getData('/api/dashboard/logins/usuarios?max=14&total=10')
    ])

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

  return (
    <APIContext.Provider
      value={{
        history: customHistory,
        handleLogin,
        logout,
        handleApiError,
        isAuthenticated,
        getAuthorization,
        isAdmin,
        getData,
        postData,
        putData,
        getUUID,
        getUsuarioInfo,
        getTurnos,
        getPostos,
        getUsuarios,
        criaUsuario,
        deletarUsuario,
        atualizaUsuario,
        autorizarUsuarios,
        resetarSenhas,
        getAplicacoes,
        atualizaAplicacao,
        deletaAplicacao,
        criaAplicacao,
        atualizaUsuarioInfo,
        atualizarSenhas,
        getDashboardData
      }}>
      {children}
    </APIContext.Provider>
  );
}

export const useAPI = () => useContext(APIContext)