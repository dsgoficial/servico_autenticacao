import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { TextField, Select } from 'formik-material-ui'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import LinkMui from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import ReactLoading from 'react-loading'

import { MessageSnackBar, BackgroundImages } from '../helpers'

import styles from './styles'
import validationSchema from './validation_schema'
import { getData, handleCadastro } from './api'

export default withRouter(props => {
  const classes = styles()
  const values = {
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

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getData()
        if (!response) {
          return
        }
        const { listaPostoGrad, listaTurnos } = response
        setListaPostoGrad(listaPostoGrad)
        setListaTurnos(listaTurnos)
        setLoaded(true)
      } catch (err) {
        setError({ msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() })
      }
    }
    loadData()
  }, [])

  const handleForm = async (values, { setSubmitting }) => {
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
        setSuccess({ msg: 'Usuário criado com sucesso. Entre em contato com o gerente para autorizar o login.', date: new Date() })
        props.history.push('/')
      }
    } catch (err) {
      if (
        'response' in err &&
        'data' in err.response &&
        'message' in err.response.data
      ) {
        setError({ msg: err.response.data.message, date: new Date() })
      } else {
        setError({ msg: 'Ocorreu um erro ao registrar sua conta. Contate o gerente.', date: new Date() })
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
                  <Field
                    type='password' name='confirmarSenha'
                    component={TextField}
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    label='Confirme a senha'
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
                  <Button
                    type='submit' disabled={isSubmitting || !isValid}
                    fullWidth
                    variant='contained'
                    color='primary'
                    className={classes.submit}
                  >
                    Cadastrar
                  </Button>
                </Form>
              )}
            </Formik>
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
      {error ? <MessageSnackBar status='error' key={error.date} msg={error.msg} /> : null}
      {success ? <MessageSnackBar status='success' key={success.date} msg={success.msg} /> : null}
    </BackgroundImages>
  )
})
