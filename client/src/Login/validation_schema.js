import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  usuario: Yup.string()
    .required('Preencha seu usuário'),
  senha: Yup.string()
    .min(6, 'A senha deve conter pelo menos 6 caracteres')
    .required('Preencha sua senha')
})

export default validationSchema
