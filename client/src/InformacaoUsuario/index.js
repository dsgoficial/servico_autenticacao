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

import { MessageSnackBar } from '../helpers'

import styles from './styles'
import validationSchema from './validation_schema'
import { getData, handleUpdate } from './api'

export default withRouter(props => {
  const classes = styles()
  const values = {
    nome: '',
    nomeGuerra: '',
    tipoPostoGradId: '',
    tipoTurnoId: '',
    cpf: '',
    identidade: '',
    validadeIdentidade: '',
    orgaoExpeditor: '',
    banco: '',
    agencia: '',
    contaBancaria: '',
    dataNascimento: '',
    celular: '',
    emailEb: ''
  }

  const [listaTurnos, setListaTurnos] = useState([])
  const [listaPostoGrad, setListaPostoGrad] = useState([])

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const usuarioData = await getData()
        values.nome = usuarioData.nome
        values.nomeGuerra = usuarioData.nomeGuerra
        values.tipoTurnoId = usuarioData.tipoTurnoId
        values.tipoTurnoId = usuarioData.tipoTurnoId
        values.cpf = usuarioData.cpf
        values.identidade = usuarioData.identidade
        values.validadeIdentidade = usuarioData.validadeIdentidade
        values.orgaoExpeditor = usuarioData.orgaoExpeditor
        values.banco = usuarioData.banco
        values.agencia = usuarioData.agencia
        values.contaBancaria = usuarioData.contaBancaria
        values.dataNascimento = usuarioData.dataNascimento
        values.celular = usuarioData.celular
        values.emailEb = usuarioData.emailEb
      } catch (err) {
        props.history.push('/erro')
      }
    }
    loadData()
  }, [])

  const handleForm = async (values, { setSubmitting }) => {
    try {
      await handleUpdate(
        values.nome,
        values.nomeGuerra,
        values.tipoTurnoId,
        values.tipoTurnoId,
        values.cpf,
        values.identidade,
        values.validadeIdentidade,
        values.orgaoExpeditor,
        values.banco,
        values.agencia,
        values.contaBancaria,
        values.dataNascimento,
        values.celular,
        values.emailEb
      )
      setSuccess(
        'Informações atualizadas com sucesso'
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
  }

  return (
    <>
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
              <ReactLoading type='bars' color='#C44D33' height='20%' width='20%' />
            </div>
          )}
      </Container>
      {error ? <MessageSnackBar status='error' msg={error} /> : null}
      {success ? <MessageSnackBar status='success' msg={success} /> : null}
    </>
  )
})
