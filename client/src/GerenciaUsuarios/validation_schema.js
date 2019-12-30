import * as Yup from 'yup'

const adicionaSchema = Yup.object().shape({
  usuario: Yup.string()
    .required('Preencha seu usuário').matches(/^[a-z]+$/, 'O nome do usuário deve ser em minúsculo e não conter espaços ou caracteres especiais'),
  nome: Yup.string()
    .required('Preencha seu nome completo'),
  nomeGuerra: Yup.string()
    .required('Preencha seu nome de guerra'),
  tipoPostoGradId: Yup.number()
    .required('Preencha seu posto/graduação'),
  tipoTurnoId: Yup.number()
    .required('Preencha seu turno de trabalho')
})

const atualizaSchema = Yup.object().shape({
  usuario: Yup.string()
    .required('Preencha seu usuário').matches(/^[a-z]+$/, 'O nome do usuário deve ser em minúsculo e não conter espaços ou caracteres especiais'),
  nome: Yup.string()
    .required('Preencha seu nome completo'),
  nomeGuerra: Yup.string()
    .required('Preencha seu nome de guerra'),
  tipoPostoGradId: Yup.number()
    .required('Preencha seu posto/graduação'),
  tipoTurnoId: Yup.number()
    .required('Preencha seu turno de trabalho'),
  cpf: Yup.string().matches(/^\d\d\d.\d\d\d.\d\d\d-\d\d$/, 'O CPF deve ser no formato 999.999.999-99'),
  identidade: Yup.string(),
  validadeIdentidade: Yup.string().nullable(),
  orgaoExpedidor: Yup.string(),
  banco: Yup.string(),
  agencia: Yup.string(),
  contaBancaria: Yup.string(),
  dataNascimento: Yup.string().nullable(),
  celular: Yup.string().matches(/^\(\d\d\)\d\d\d\d\d-\d\d\d\d$/, 'O celular deve ser no formato ( _ _ ) _ _ _ _-_ _ _ _ _'),
  emailEb: Yup.string().email('Formato inválido para um email'),
  ativo: Yup.boolean(),
  administrador: Yup.boolean()
})

export { adicionaSchema, atualizaSchema }
