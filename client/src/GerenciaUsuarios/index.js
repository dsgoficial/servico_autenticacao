import React, { useState, useEffect, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';

import { getUsuarios } from './api'
import { MessageSnackBar, MaterialTable } from '../helpers'
import DialogoDelete from './dialogo_delete'
import DialogoAdiciona from './dialogo_adiciona'

export default withRouter(props => {

  const [usuarios, setUsuarios] = useState([])
  const [snackbar, setSnackbar] = useState('')
  const [openDeleteDialog, setOpenDeleteDialog] = useState({})
  const [openAdicionaDialog, setOpenAdicionaDialog] = useState({})
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

  const editarUsuario = (event, rowData) => {
    alert("EDITAR")
  }

  const deletarUsuario = (event, rowData) => {
    setOpenDeleteDialog({
      open: true,
      uuid: rowData.uuid,
      nome: `${rowData.tipo_posto_grad} ${rowData.nome_guerra}`
    })
  }

  const adicionarUsuario = (event, rowData) => {
    setOpenAdicionaDialog({
      open: true
    })
  }

  const handleAdicionaDialog = useMemo(() => ((status, msg) => {
    setOpenAdicionaDialog({})
    setRefresh(new Date())
    if (status && msg) {
      setSnackbar({ status, msg, date: new Date() })
    }
  }), [])

  const handleDeleteDialog = useMemo(() => ((status, msg) => {
    setOpenDeleteDialog({})
    setRefresh(new Date())
    if (status && msg) {
      setSnackbar({ status, msg, date: new Date() })
    }
  }), [])

  return (
    <>
      <MaterialTable
        title="Usuários"
        columns={[
          { title: 'Login', field: 'login' },
          { title: 'Posto/Graducao', field: 'tipo_posto_grad' },
          { title: 'Nome Guerra', field: 'nome_guerra' },
          { title: 'Nome completo', field: 'nome' },
          { title: 'Ativo', field: 'ativo', type: 'boolean' },
          { title: 'Administrador', field: 'administrador', type: 'boolean' },
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
      {openDeleteDialog ? <DialogoDelete
        open={openDeleteDialog.open}
        uuid={openDeleteDialog.uuid}
        nome={openDeleteDialog.nome}
        handleDialog={handleDeleteDialog}
      /> : null}
      {openAdicionaDialog ? <DialogoAdiciona
        open={openAdicionaDialog.open}
        handleDialog={handleAdicionaDialog}
      /> : null}
      {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
    </>
  )
})