import React, { useState, useEffect, useMemo } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactLoading from 'react-loading'
import { Formik, Form, Field } from 'formik'
import { TextField, Select, CheckboxWithLabel } from 'formik-material-ui'
import MenuItem from '@material-ui/core/MenuItem'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker } from 'material-ui-formik-components/DatePicker'
import ptLocale from "date-fns/locale/pt-BR";

import { atualizaUsuario, getSelectData } from './api'
import { atualizaSchema } from './validation_schema'
import { SubmitButton } from '../helpers'
import styles from './styles'

const DialogoAtualiza = ({ open = false, usuario = {}, handleDialog }) => {
  const classes = styles();

  const initialValues = useMemo(() => ({
    usuario: usuario.login || '',
    nome: usuario.nome || '',
    nomeGuerra: usuario.nome_guerra || '',
    tipoPostoGradId: usuario.tipo_posto_grad_id || '',
    tipoTurnoId: usuario.tipo_turno_id || '',
    cpf: usuario.cpf || '',
    identidade: usuario.identidade || '',
    validadeIdentidade: usuario.validade_identidade,
    orgaoExpedidor: usuario.orgao_expedidor || '',
    banco: usuario.banco || '',
    agencia: usuario.agencia || '',
    contaBancaria: usuario.conta_bancaria || '',
    dataNascimento: usuario.data_nascimento,
    celular: usuario.celular || '',
    emailEb: usuario.email_eb || '',
    administrador: usuario.administrador || false,
    ativo: usuario.ativo || false
  }), [usuario])

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
      const response = await atualizaUsuario(
        usuario.uuid,
        values.usuario,
        values.nome,
        values.nomeGuerra,
        values.tipoTurnoId,
        values.tipoPostoGradId,
        values.cpf,
        values.identidade,
        values.validadeIdentidade,
        values.orgaoExpedidor,
        values.banco,
        values.agencia,
        values.contaBancaria,
        values.dataNascimento,
        values.celular,
        values.emailEb,
        values.administrador,
        values.ativo
      )
      if (!response) return
      setSubmitting(false)
      handleDialog('success', 'Usuário atualizado com sucesso.')
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
      <DialogTitle>Atualizar usuário</DialogTitle>
      <DialogContent>
        {loaded ? (
          <>
            <Formik
              initialValues={initialValues}
              validationSchema={atualizaSchema}
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
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                    <Field
                      name='dataNascimento'
                      component={DatePicker}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Data de nascimento'
                      format="dd/MM/yyyy"
                      autoOk
                      allowKeyboardControl
                      clearable
                    />
                  </MuiPickersUtilsProvider>
                  <Field
                    name='celular'
                    component={TextField}
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    label='Celular'
                  />
                  <Field
                    name='emailEb'
                    component={TextField}
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    label='Email (EB)'
                  />
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
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                    <Field
                      name='validadeIdentidade'
                      component={DatePicker}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Data de validade da identidade'
                      format="dd/MM/yyyy"
                      autoOk
                      allowKeyboardControl
                      clearable
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
                    name='banco'
                    component={TextField}
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    label='Banco'
                  />
                  <Field
                    name='agencia'
                    component={TextField}
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    label='Agência'
                  />
                  <Field
                    name='contaBancaria'
                    component={TextField}
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    label='Conta bancária'
                  />
                  <div>
                    <Field
                      name='administrador'
                      component={CheckboxWithLabel}
                      variant='outlined'
                      margin='normal'
                      Label={{ label: 'Administrador' }}
                      color="primary"
                    />
                  </div>
                  <div>
                    <Field
                      name='ativo'
                      component={CheckboxWithLabel}
                      variant='outlined'
                      margin='normal'
                      Label={{ label: 'Ativo' }}
                      color="primary"
                    />
                  </div>
                  <SubmitButton
                    type='submit' disabled={isValidating || !isValid} submitting={isSubmitting}
                    fullWidth
                    variant='contained'
                    color='primary'
                    className={classes.submit}
                  >
                    Atualizar
                  </SubmitButton>
                </Form>
              )}
            </Formik>
          </>
        ) : (
            <div className={classes.loading}>
              <ReactLoading type='bars' color='#F83737' height='40%' width='40%' />
            </div>
          )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={submitting} autoFocus>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog >
  );
}

export default DialogoAtualiza
