import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Preencha seu nome completo'),
  nomeGuerra: Yup.string()
    .required('Preencha seu nome de guerra'),
  tipoPostoGradId: Yup.number()
    .required('Preencha seu posto/graduação')
})

export default validationSchema
