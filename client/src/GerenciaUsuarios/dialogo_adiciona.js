import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactLoading from 'react-loading'
import { Formik, Form, Field } from 'formik'
import { TextField, Select } from 'formik-material-ui'

import { criaUsuario, getSelectData } from './api'

import { adicionaSchema } from './validation_schema'

import { SubmitButton } from '../helpers'

import styles from './styles'

const DialogoUsuario = ({ open = false, handleDialog }) => {
  const classes = styles();

  const initialValues = {
    usuario: '',
    nome: '',
    nomeGuerra: '',
    tipoPostoGradId: '',
    tipoTurnoId: '',
    ativo: true,
    administrador: false
  }

  const [listaTurnos, setListaTurnos] = useState([])
  const [listaPostoGrad, setListaPostoGrad] = useState([])

  const [submitting, setSubmitting] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getSelectData()
        if (!response) return
        const { listaPostoGrad, listaTurnos } = response
        setListaPostoGrad(listaPostoGrad)
        setListaTurnos(listaTurnos)
        setLoaded(true)
      } catch (err) {
        handleDialog('error', 'Ocorreu um erro ao se comunicar com o servidor.')
      }
    }
    loadData()
  }, [handleDialog])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    handleDialog()
  }

  const handleForm = async (values, { resetForm }) => {
    try {
      setSubmitting(true)
      const response = await criaUsuario(
        values.usuario,
        values.nome,
        values.nomeGuerra,
        values.tipoTurnoId,
        values.tipoPostoGradId,
        values.ativo,
        values.administrador
      )
      if (!response) return
      setSubmitting(false)
      handleDialog('success', 'Usuário criado com sucesso.')
    } catch (err) {
      setSubmitting(false)
      resetForm(initialValues)
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
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Adicionar usuário</DialogTitle>
      <DialogContent>
        {loaded ? (
          <>
            <DialogContentText id="alert-dialog-description">
              Adicionar novo usuário
            </DialogContentText>
            <Formik
              initialValues={initialValues}
              validationSchema={adicionaSchema}
              onSubmit={handleForm}
            >
              {({ isValid, isSubmitting, errors, touched }) => (
                <Form className={classes.form}>
                  <Field
                    name='nome'
                    component={TextField}
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    label='Nome completo'
                  />
                  <Field
                    name='nomeGuerra'
                    component={TextField}
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    label='Nome de guerra'
                  />
                </Form>
              )}
            </Formik>
          </>
        ) : (
            <div className={classes.loading}>
              <ReactLoading type='bars' color='#F83737' height='40%' width='40%' />
            </div>
          )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={submitting} autoFocus>
          Cancelar
          </Button>
        <SubmitButton onClick={handleForm} color="secondary" submitting={submitting}>
          Confirmar
            </SubmitButton>
      </DialogActions>
    </Dialog >
  );
}

export default DialogoUsuario
