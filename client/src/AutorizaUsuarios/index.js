import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'

import { getUsuarios, autorizarUsuarios, resetarSenhas } from './api'
import { MessageSnackBar, MaterialTable, DialogoConfirmacao } from '../helpers'
import { handleApiError } from '../services'

export default withRouter(props => {
  const [usuarios, setUsuarios] = useState([])
  const [snackbar, setSnackbar] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let isCurrent = true
    const load = async () => {
      try {
        const response = await getUsuarios()
        if (!response || !isCurrent) return
        setUsuarios(response)
        setLoaded(true)
      } catch (err) {
        if (!isCurrent) return
        handleApiError(err, setSnackbar)
      }
    }
    load()

    return () => {
      isCurrent = false
    }
  }, [refresh])

  const handleAutorizarUsuario = (event, data) => {
    setOpenConfirmDialog({
      open: true,
      title: 'Autorizar usuários',
      msg: 'Deseja realmente autorizar os usuários selecionados?',
      handleDialog: executeAutorizarUsuario(data, true)
    })
  }

  const handleRemoverAutorizacao = (event, data) => {
    setOpenConfirmDialog({
      open: true,
      title: 'Remover autorização',
      msg: 'Deseja realmente remover a autorização dos usuários selecionados?',
      handleDialog: executeAutorizarUsuario(data, false)
    })
  }

  const executeAutorizarUsuario = (data, autoriza) => {
    return async (confirm) => {
      if (confirm) {
        try {
          const uuids = data.map(d => (d.uuid))
          const success = await autorizarUsuarios(uuids, autoriza)
          if (success) {
            setRefresh(new Date())
            setSnackbar({ status: 'success', msg: 'Autorização modificada com sucesso', date: new Date() })
          }
        } catch (err) {
          setRefresh(new Date())
          handleApiError(err, setSnackbar)
        }
      }
      setOpenConfirmDialog({})
    }
  }

  const handleResetarSenha = (event, data) => {
    setOpenConfirmDialog({
      open: true,
      title: 'Reseta senhas',
      msg: 'Deseja realmente resetar a senha dos usuários selecionados?',
      handleDialog: executeResetarSenha(data)
    })
  }

  const executeResetarSenha = data => {
    return async (confirm) => {
      if (confirm) {
        try {
          const uuids = data.map(d => (d.uuid))
          const success = await resetarSenhas(uuids)
          if (success) {
            setRefresh(new Date())
            setSnackbar({ status: 'success', msg: 'Senhas resetadas com sucesso', date: new Date() })
          }
        } catch (err) {
          handleApiError(err, setSnackbar)
        }
      }
      setOpenConfirmDialog({})
    }
  }

  return (
    <>
      <MaterialTable
        title='Usuários'
        loaded={loaded}
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
            icon: RemoveCircleOutlineIcon,
            tooltip: 'Remover autorização',
            onClick: handleRemoverAutorizacao
          },
          {
            icon: LockOpenIcon,
            tooltip: 'Resetar senha',
            onClick: handleResetarSenha
          }
        ]}
        options={{
          selection: true
        }}
      />
      {openConfirmDialog ? (
        <DialogoConfirmacao
          open={openConfirmDialog.open}
          title={openConfirmDialog.title}
          msg={openConfirmDialog.msg}
          onClose={openConfirmDialog.handleDialog}
        />
      ) : null}
      {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
    </>
  )
})
