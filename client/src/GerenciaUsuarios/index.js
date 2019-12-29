import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';

import { getUsuarios } from './api'
import { MessageSnackBar, MaterialTable } from '../helpers'

export default withRouter(props => {

  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getUsuarios()
        if (!response) {
          return
        }
        setUsuarios(response)
      } catch (err) {
        setError({ msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() })
      }
    }
    loadData()
  }, [])

  const editarUsuario = event => {
    alert("EDITAR")
  }
  const deletarUsuario = event => {
    alert("DELETAR")
  }
  const adicionarUsuario = event => {
    alert("ADICIONAR")
  }

  return (
    <>
      <MaterialTable
        title="Usuários"
        columns={[
          { title: 'Login', field: 'login' },
          { title: 'Posto/Graducao', field: 'tipo_posto_grad' },
          { title: 'Nome Guerra', field: 'nome_guerra' },
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
      {error ? <MessageSnackBar status='error' key={error.date} msg={error.msg} /> : null}
    </>
  )
})