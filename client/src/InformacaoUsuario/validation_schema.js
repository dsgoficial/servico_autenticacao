import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Preencha seu nome completo'),
  nomeGuerra: Yup.string()
    .required('Preencha seu nome de guerra'),
  tipoPostoGradId: Yup.number()
    .required('Preencha seu posto/graduação'),
  tipoTurnoId: Yup.number()
    .required('Preencha seu turno de trabalho')
})

export default validationSchema
