import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Avatar from '@material-ui/core/Avatar'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import LinkMui from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import styles from './styles'
import validationSchema from './validation_schema'
import handleLogin from './handle_login'

import { MessageSnackBar } from '../helpers'

export default withRouter(props => {
  const classes = styles()
  const values = { usuario: '', senha: '' }

  const [error, setError] = useState('')

  const handleForm = async (values, { setSubmitting }) => {
    try {
      await handleLogin(values.usuario, values.senha)
      props.history.push('/')
    } catch (err) {
      if (
        'response' in err &&
        'data' in err.response &&
        'message' in err.response.data
      ) {
        setError(err.response.data.message)
      } else {
        setError('Houve um problema com o login, verifique suas credenciais.')
      }
    }
  }

  return (
    <>
      <Container component='main' maxWidth='xs'>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Serviço de Autenticação
          </Typography>
          <Formik
            initialValues={values}
            validationSchema={validationSchema}
            onSubmit={handleForm}
          >
            {({ isValid, isSubmitting, errors, touched }) => (
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
                  type='password' name='senha'
                  component={TextField}
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  label='Senha'
                />
                <Button
                  type='submit' disabled={isSubmitting || !isValid}
                  fullWidth
                  variant='contained'
                  color='primary'
                  className={classes.submit}
                >
                  Entrar
                </Button>
              </Form>
            )}
          </Formik>
          <Grid container justify='flex-end'>
            <Grid item>
              <LinkMui to='/cadastro' variant='body2' component={Link} className={classes.link}>
                Criar novo usuário
              </LinkMui>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      {error ? <MessageSnackBar status='error' msg={error} /> : null}
    </>
  )
})
