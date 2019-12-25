import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  usuario: Yup.string()
    .required('Preencha seu usuário'),
  senha: Yup.string()
    .min(6, 'A senha deve conter pelo menos 6 caracteres')
    .required('Preencha sua senha'),
  confirmarSenha: Yup.string()
    .required('Confirme sua senha')
    .oneOf([Yup.ref('senha')], 'As senhas devem ser iguais'),
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
