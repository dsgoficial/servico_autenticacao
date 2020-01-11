import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'

import { MessageSnackBar, SubmitButton } from '../helpers'
import { handleApiError } from '../services'
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
      handleApiError(err, setSnackbar)
    }
  }

  return (
    <>
      <Container maxWidth='sm'>
        <Paper className={classes.paper}>
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
        </Paper>
      </Container>
      {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
    </>
  )
})
