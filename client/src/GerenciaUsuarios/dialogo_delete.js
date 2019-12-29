import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { deletarUsuario } from './api'
import { SubmitButton } from '../helpers'

const DialogoDelete = ({ open = false, uuid, nome, handleDialog }) => {

  const [submitting, setSubmitting] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    handleDialog()
  }

  const handleConfirm = async () => {
    try {
      setSubmitting(true)
      const response = await deletarUsuario(uuid)
      if (!response) return
      setSubmitting(false)
      handleDialog('success', 'Usuário deletado com sucesso.')
    } catch (err) {
      setSubmitting(false)
      if (
        'response' in err &&
        'data' in err.response &&
        'message' in err.response.data
      ) {
        handleDialog('error', err.response.data.message)
      } else {
        handleDialog('error', 'Ocorreu um erro ao se comunicar com o servidor.')
      }
    }
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Deletar usuário</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deseja realmente deletar o usuário {nome}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={submitting} autoFocus>
          Cancelar
          </Button>
        <SubmitButton onClick={handleConfirm} color="secondary" submitting={submitting}>
          Confirmar
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogoDelete
