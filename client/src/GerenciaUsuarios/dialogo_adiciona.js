import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ReactLoading from 'react-loading'
import { Formik, Form, Field } from 'formik'
import { TextField, Select } from 'formik-material-ui'
import MenuItem from '@material-ui/core/MenuItem'

import { criaUsuario, getSelectData } from './api'
import { adicionaSchema } from './validation_schema'
import { SubmitButton } from '../helpers'
import styles from './styles'

const DialogoAdiciona = ({ open = false, handleDialog }) => {
  const classes = styles()

  const initialValues = {
    usuario: '',
    nome: '',
    nomeGuerra: '',
    tipoPostoGradId: '',
    tipoTurnoId: ''
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
        values.tipoPostoGradId
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
    <Dialog open={open}>
      <DialogTitle>Adicionar usuário</DialogTitle>
      <DialogContent>
        {loaded ? (
          <>
            <Formik
              initialValues={initialValues}
              validationSchema={adicionaSchema}
              onSubmit={handleForm}
            >
              {({ isValid, isSubmitting, isValidating }) => (
                <Form className={classes.form}>
                  <Field
                    name='usuario'
                    component={TextField}
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    label='Usuário'
                  />
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
                  <div>
                    <Field
                      name='tipoPostoGradId'
                      label='Posto/Graduação'
                      variant='outlined'
                      component={Select}
                      displayEmpty
                      className={classes.select}
                    >
                      <MenuItem value='' disabled>
                        Selecione seu Posto/Graduação
                      </MenuItem>
                      {listaPostoGrad.map(option => (
                        <MenuItem key={option.code} value={option.code}>
                          {option.nome}
                        </MenuItem>
                      ))}
                    </Field>
                  </div>
                  <div>
                    <Field
                      name='tipoTurnoId'
                      label='Turno'
                      variant='outlined'
                      component={Select}
                      displayEmpty
                      className={classes.select}
                    >
                      <MenuItem value='' disabled>
                        Selecione seu turno de trabalho
                      </MenuItem>
                      {listaTurnos.map(option => (
                        <MenuItem key={option.code} value={option.code}>
                          {option.nome}
                        </MenuItem>
                      ))}
                    </Field>
                  </div>
                  <SubmitButton
                    type='submit' disabled={isValidating || !isValid} submitting={isSubmitting}
                    fullWidth
                    variant='contained'
                    color='primary'
                    className={classes.submit}
                  >
                    Cadastrar
                  </SubmitButton>
                </Form>
              )}
            </Formik>
            <DialogContentText>
              A senha do usuário criado será igual ao login.
            </DialogContentText>
          </>
        ) : (
          <div className={classes.loading}>
            <ReactLoading type='bars' color='#F83737' height='40%' width='40%' />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary' disabled={submitting} autoFocus>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogoAdiciona
