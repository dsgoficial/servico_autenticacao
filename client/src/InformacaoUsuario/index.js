import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { TextField, Select } from 'formik-material-ui'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import ReactLoading from 'react-loading'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';

import { MessageSnackBar, FormikKeyboardDatePicker } from '../helpers'

import styles from './styles'
import validationSchema from './validation_schema'
import { getUserData, getSelectData, handleUpdate } from './api'

export default withRouter(props => {
  const classes = styles()

  const [initialValues, setInitialValues] = useState({
    nome: '',
    nomeGuerra: '',
    tipoPostoGradId: '',
    tipoTurnoId: '',
    cpf: '',
    identidade: '',
    validadeIdentidade: '',
    orgaoExpedidor: '',
    banco: '',
    agencia: '',
    contaBancaria: '',
    dataNascimento: '',
    celular: '',
    emailEb: ''
  })

  const initialValues2 = {
    nome: '',
    nomeGuerra: '',
    tipoPostoGradId: '',
    tipoTurnoId: '',
    cpf: '',
    identidade: '',
    validadeIdentidade: '',
    orgaoExpedidor: '',
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
        const usuarioData = await getUserData()
        setInitialValues({
          nome: usuarioData.nome || '',
          nomeGuerra: usuarioData.nome_guerra || '',
          tipoPostoGradId: usuarioData.tipo_posto_grad_id || '',
          tipoTurnoId: usuarioData.tipo_turno_id || '',
          cpf: usuarioData.cpf || '',
          identidade: usuarioData.identidade || '',
          validadeIdentidade: usuarioData.validade_identidade || '',
          orgaoExpedidor: usuarioData.orgao_expedidor || '',
          banco: usuarioData.banco || '',
          agencia: usuarioData.agencia || '',
          contaBancaria: usuarioData.conta_bancaria || '',
          dataNascimento: usuarioData.data_nascimento || '',
          celular: usuarioData.celular || '',
          emailEb: usuarioData.email_eb || ''
        })
        const { listaPostoGrad, listaTurnos } = await getSelectData()
        setListaPostoGrad(listaPostoGrad)
        setListaTurnos(listaTurnos)

        setLoaded(true)
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
        values.tipoPostoGradId,
        values.tipoTurnoId,
        values.cpf,
        values.identidade,
        values.validadeIdentidade,
        values.orgaoExpedidor,
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
      props.history.push('/')
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
              Atualizar dados do usuário
            </Typography>
            <Formik
              initialValues={initialValues2}
              validationSchema={validationSchema}
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
                  <Field
                      name='cpf'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='CPF'
                  />
                  <Field
                      name='identidade'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Identidade'
                  />
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Field
                      name='validadeIdentidade2'
                      component={FormikKeyboardDatePicker}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Data de validade da identidade'
                  />
                  </MuiPickersUtilsProvider>
                  <Field
                      name='orgaoExpedidor'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Órgão Expedidor'
                  />
                  <Field
                      name='celular'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Celular'
                  />
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
