import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import LockOpenIcon from '@material-ui/icons/LockOpen'

import { getUsuarios, autorizarUsuarios, resetarSenhas } from './api'
import { MessageSnackBar, MaterialTable } from '../helpers'

export default withRouter(props => {
  const [usuarios, setUsuarios] = useState([])
  const [snackbar, setSnackbar] = useState('')
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getUsuarios()
        if (!response) return
        setUsuarios(response)
      } catch (err) {
        setSnackbar({ status: 'error', msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() })
      }
    }
    loadData()
  }, [refresh])

  const handleResetarSenha = async (event, data) => {
    try {
      const uuids = data.map(d => (d.uuid))
      const success = await resetarSenhas(uuids)
      if (success) {
        setSnackbar({ status: 'success', msg: 'Senhas resetadas com sucesso', date: new Date() })
        setRefresh(new Date())
      }
    } catch (err) {
      if (
        'response' in err &&
        'data' in err.response &&
        'message' in err.response.data
      ) {
        setSnackbar({ status: 'error', msg: err.response.data.message, date: new Date() })
      } else {
        setSnackbar({ status: 'error', msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() })
      }
    }
  }

  const handleAutorizarUsuario = async (event, data) => {
    try {
      const uuids = data.map(d => (d.uuid))
      const success = await autorizarUsuarios(uuids)
      if (success) {
        setSnackbar({ status: 'success', msg: 'Usuários autorizados com sucesso', date: new Date() })
        setRefresh(new Date())
      }
    } catch (err) {
      if (
        'response' in err &&
        'data' in err.response &&
        'message' in err.response.data
      ) {
        setSnackbar({ status: 'error', msg: err.response.data.message, date: new Date() })
      } else {
        setSnackbar({ status: 'error', msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() })
      }
    }
  }

  return (
    <>
      <MaterialTable
        title='Usuários'
        columns={[
          { title: 'Login', field: 'login' },
          { title: 'Posto/Graducao', field: 'tipo_posto_grad' },
          { title: 'Nome Guerra', field: 'nome_guerra' },
          { title: 'Nome completo', field: 'nome' },
          { title: 'Ativo', field: 'ativo', type: 'boolean' },
          { title: 'Administrador', field: 'administrador', type: 'boolean' }
        ]}
        data={usuarios}
        actions={[
          {
            icon: DoneAllIcon,
            tooltip: 'Autorizar usuário',
            onClick: handleAutorizarUsuario
          },
          {
            icon: LockOpenIcon,
            tooltip: 'Resetar senha',
            onClick: handleResetarSenha
          }
        ]}
        options={{
          selection: true,
          selectionProps: rowData => ({
            disabled: rowData.administrador
          })
        }}
      />
      {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
    </>
  )
})
