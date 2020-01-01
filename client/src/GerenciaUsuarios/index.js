import React, { useState, useMemo, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Edit from '@material-ui/icons/Edit'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'

import { getUsuarios, deletarUsuario as deletarUsuarioApi } from './api'
import { MessageSnackBar, MaterialTable, DialogoConfirmacao } from '../helpers'
import DialogoAdiciona from './dialogo_adiciona'
import DialogoAtualiza from './dialogo_atualiza'

export default withRouter(props => {
  const [usuarios, setUsuarios] = useState([])
  const [snackbar, setSnackbar] = useState('')
  const [openDeleteDialog, setOpenDeleteDialog] = useState({})
  const [openAdicionaDialog, setOpenAdicionaDialog] = useState({})
  const [openAtualizaDialog, setOpenAtualizaDialog] = useState({})
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    let isCurrent = true

    const load = async () => {
      try {
        const response = await getUsuarios()
        if (!response || !isCurrent) return

        setUsuarios(response)
      } catch (err) {
        setSnackbar({ status: 'error', msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() })
      }
    }
    load()

    return () => {
      isCurrent = false
    }
  }, [refresh])

  const editarUsuario = (event, rowData) => {
    setOpenAtualizaDialog({
      open: true,
      usuario: rowData
    })
  }

  const deletarUsuario = (event, rowData) => {
    setOpenDeleteDialog({
      open: true,
      title: 'Resetar senha',
      msg: `Deseja realmente deletar o usuário ${rowData.tipo_posto_grad} ${rowData.nome_guerra}`,
      handleDialog: executeDelete(rowData.uuid)
    })
  }

  const adicionarUsuario = (event, rowData) => {
    setOpenAdicionaDialog({
      open: true
    })
  }

  const handleAdicionaDialog = useMemo(() => (status, msg) => {
    setOpenAdicionaDialog({})
    setRefresh(new Date())
    if (status && msg) {
      setSnackbar({ status, msg, date: new Date() })
    }
  }, [])

  const executeDelete = uuid => {
    return async function (confirm) {
      if (confirm) {
        try {
          const success = await deletarUsuarioApi(uuid)
          if (success) {
            setSnackbar({ status: 'success', msg: 'Usuário deletado com sucesso.', date: new Date() })
            setRefresh(new Date())
          }
        } catch (err) {
          setRefresh(new Date())
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
      setOpenDeleteDialog({})
    }
  }

  const handleAtualizaDialog = useMemo(() => (status, msg) => {
    setOpenAtualizaDialog({})
    setRefresh(new Date())
    if (status && msg) {
      setSnackbar({ status, msg, date: new Date() })
    }
  }, [])

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
            icon: Edit,
            tooltip: 'Editar usuário',
            onClick: editarUsuario
          },
          {
            icon: Delete,
            tooltip: 'Deletar usuário',
            onClick: deletarUsuario
          },
          {
            icon: Add,
            tooltip: 'Adicionar usuário',
            isFreeAction: true,
            onClick: adicionarUsuario
          }
        ]}
      />
      {openDeleteDialog ? (
        <DialogoConfirmacao
          open={openDeleteDialog.open}
          title={openDeleteDialog.title}
          msg={openDeleteDialog.msg}
          onClose={openDeleteDialog.handleDialog}
        />
      ) : null}
      {openAdicionaDialog
        ? (
          <DialogoAdiciona
            open={openAdicionaDialog.open}
            handleDialog={handleAdicionaDialog}
          />
        )
        : null}
      {openAtualizaDialog
        ? (
          <DialogoAtualiza
            open={openAtualizaDialog.open}
            usuario={openAtualizaDialog.usuario}
            handleDialog={handleAtualizaDialog}
          />
        )
        : null}
      {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
    </>
  )
})
