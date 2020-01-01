import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import LinkMui from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import ReactLoading from 'react-loading'
import { useAsync } from 'react-async-hook'

import { MessageSnackBar, BackgroundImages } from '../helpers'

import CadastroForm from './cadastro_form'

import styles from './styles'
import validationSchema from './validation_schema'
import { getData, handleCadastro } from './api'

export default withRouter(props => {
  const classes = styles()
  const initialValues = {
    usuario: '',
    senha: '',
    confirmarSenha: '',
    nome: '',
    nomeGuerra: '',
    tipoPostoGradId: '',
    tipoTurnoId: ''
  }

  const [listaTurnos, setListaTurnos] = useState([])
  const [listaPostoGrad, setListaPostoGrad] = useState([])

  const [snackbar, setSnackbar] = useState('')
  const [loaded, setLoaded] = useState(false)

  useAsync(async () => {
    try {
      const response = await getData()
      if (!response) return

      const { listaPostoGrad, listaTurnos } = response
      setListaPostoGrad(listaPostoGrad)
      setListaTurnos(listaTurnos)
      setLoaded(true)
    } catch (err) {
      setSnackbar({ status: 'error', msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() })
    }
  }, [])

  const handleForm = async (values, { resetForm }) => {
    try {
      const success = await handleCadastro(
        values.usuario,
        values.senha,
        values.nome,
        values.nomeGuerra,
        values.tipoTurnoId,
        values.tipoPostoGradId
      )
      if (success) {
        setSnackbar({ status: 'success', msg: 'Usuário criado com sucesso. Entre em contato com o gerente para autorizar o login.', date: new Date() })
        resetForm(initialValues)
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
        setSnackbar({ status: 'error', msg: 'Ocorreu um erro ao registrar sua conta. Contate o gerente.', date: new Date() })
      }
    }
  }

  return (
    <BackgroundImages>
      <Container component='main' maxWidth='xs'>
        {loaded ? (
          <Paper className={classes.paper}>
            <Typography component='h1' variant='h5'>
              Cadastro de novo usuário
            </Typography>
            <CadastroForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleForm}
              listaTurnos={listaTurnos}
              listaPostoGrad={listaPostoGrad}
            />
            <Grid container justify='flex-end'>
              <Grid item>
                <LinkMui to='/login' variant='body2' component={Link} className={classes.link}>
                  Fazer login
                </LinkMui>
              </Grid>
            </Grid>
          </Paper>
        )
          : (
            <div className={classes.loading}>
              <ReactLoading type='bars' color='#F83737' height='40%' width='40%' />
            </div>
          )}
      </Container>
      {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
    </BackgroundImages>
  )
})
