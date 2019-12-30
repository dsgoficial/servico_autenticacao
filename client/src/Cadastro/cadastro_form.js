import React from 'react'
import { Formik, Form, Field } from 'formik'
import { TextField, Select } from 'formik-material-ui'
import MenuItem from '@material-ui/core/MenuItem'

import styles from './styles'

import { SubmitButton } from '../helpers'

export default ({ initialValues, validationSchema, onSubmit, listaTurnos = [], listaPostoGrad = [] }) => {
  const classes = styles()

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
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
          <SubmitButton
            type='submit' disabled={isValidating || !isValid} submitting={isSubmitting}
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Cadastrar
          </SubmitButton>
        </Form>
      )}
    </Formik>
  )
}
