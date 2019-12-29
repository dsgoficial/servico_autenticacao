import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

import { MessageSnackBar, SubmitButton } from '../helpers'

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

  const [snackbar, setSnackbar] = useState('')

  const handleForm = async (values, { resetForm }) => {
    try {
      const success = await handleUpdate(
        values.senhaAtual,
        values.senhaNova
      )
      if (success) {
        resetForm(initialValues)
        setSnackbar({ status: 'success', msg: 'Senha atualizada com sucesso', date: new Date() })
      }
    } catch (err) {
      resetForm(initialValues)
      if (
        'response' in err &&
        'data' in err.response &&
        'message' in err.response.data
      ) {
        setSnackbar({ status: 'error', msg: err.response.data.message, date: new Date() })
      } else {
        setSnackbar({ status: 'error', msg: 'Ocorreu um erro ao atualizar suas informações. Contate o gerente.', date: new Date() })
      }
    }
  }

  return (
    <>
      <Container maxWidth='sm'>
        <div className={classes.formArea}>
          <Typography component='h1' variant='h5'>
            Atualizar senha
            </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleForm}
          >
            {({ isValid, isSubmitting, isValidating }) => (
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
                <SubmitButton
                  type='submit' disabled={isValidating || !isValid} submitting={isSubmitting}
                  fullWidth
                  variant='contained'
                  color='primary'
                  className={classes.submit}
                >
                  Atualizar senha
                  </SubmitButton>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
      {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
    </>
  )
})
