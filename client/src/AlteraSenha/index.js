import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { TextField, Select } from 'formik-material-ui'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'

import { MessageSnackBar } from '../helpers'

import styles from './styles'
import validationSchema from './validation_schema'
import { handleUpdate } from './api'

export default withRouter(props => {
  const classes = styles()

  const initialValues = {
    senhaAtual: '',
    senhaNova: '',
    confirmarSenhaNova: ''
  }

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleForm = async (values, { setSubmitting, resetForm }) => {
    try {
      await handleUpdate(
        values.senhaAtual,
        values.senhaNova
      )
      setSuccess(
        'Senha atualizada com sucesso'
      )
    } catch (err) {
      if (
        'response' in err &&
        'data' in err.response &&
        'message' in err.response.data
      ) {
        setError(err.response.data.message)
      } else {
        setError('Ocorreu um erro ao atualizar suas informações. Contate o gerente.')
      }
    }
    resetForm(initialValues)
  }

  return (
    <>
      <Container component='main' maxWidth='xs'>
        <div className={classes.formArea}>
          <Typography component='h1' variant='h5'>
            Atualizar senha
            </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleForm}
          >
            {({ isValid, isSubmitting, errors, touched }) => (
              <Form className={classes.form}>
                <Field
                  name='senhaAtual'
                  component={TextField}
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  label='Senha atual'
                  type='password'
                />
                <Field
                  name='senhaNova'
                  component={TextField}
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  label='Nova senha'
                  type='password'
                />
                <Field
                  name='confirmarSenhaNova'
                  component={TextField}
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  label='Confirmar nova senha'
                  type='password'
                />
                <Button
                  type='submit' disabled={isSubmitting || !isValid}
                  fullWidth
                  variant='contained'
                  color='primary'
                  className={classes.submit}
                >
                  Atualizar senha
                  </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
      {error ? <MessageSnackBar status='error' msg={error} /> : null}
      {success ? <MessageSnackBar status='success' msg={success} /> : null}
    </>
  )
})
