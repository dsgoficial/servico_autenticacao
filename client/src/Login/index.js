import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import LinkMui from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import styles from './styles'
import validationSchema from './validation_schema'
import { handleLogin } from './api'
import LoginForm from './login_form'

import { MessageSnackBar, BackgroundImages } from '../helpers'

export default withRouter(props => {
  const classes = styles()
  const values = { usuario: '', senha: '' }

  const [snackbar, setSnackbar] = useState('')

  const handleForm = async (values) => {
    try {
      const success = await handleLogin(values.usuario, values.senha)
      if (success) props.history.push('/')
    } catch (err) {
      if (
        'response' in err &&
        'data' in err.response &&
        'message' in err.response.data
      ) {
        setSnackbar({ status: 'error', msg: err.response.data.message, date: new Date() })
      } else {
        setSnackbar({ status: 'error', msg: 'Houve um problema com o login, verifique suas credenciais.', date: new Date() })
      }
    }
  }

  return (
    <BackgroundImages>
      <div className={classes.overflow}>
        <Container component='main' maxWidth='xs'>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Serviço de Autenticação
            </Typography>
            <LoginForm
              initialValues={values}
              validationSchema={validationSchema}
              onSubmit={handleForm}
            />
            <Grid container justify='flex-end'>
              <Grid item>
                <LinkMui to='/cadastro' variant='body2' component={Link} className={classes.link}>
                  Criar novo usuário
                </LinkMui>
              </Grid>
            </Grid>
          </Paper>
        </Container>
        {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
      </div>
    </BackgroundImages>
  )
})
