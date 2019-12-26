import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Preencha seu nome completo'),
  nomeGuerra: Yup.string()
    .required('Preencha seu nome de guerra'),
  tipoPostoGradId: Yup.number()
    .required('Preencha seu posto/graduação'),
  tipoTurnoId: Yup.number()
    .required('Preencha seu turno de trabalho'),
  cpf: Yup.string(),
  identidade: Yup.string(),
  validadeIdentidade: Yup.date(),
  orgaoExpeditor: Yup.string(),
  banco: Yup.string(),
  agencia: Yup.string(),
  contaBancaria: Yup.string(),
  dataNascimento: Yup.date(),
  celular: Yup.date(),
  emailEb: Yup.string().email('Formato inválido para um email'),
})

export default validationSchema
