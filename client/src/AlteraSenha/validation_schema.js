import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  senhaAtual: Yup.string()
    .required('Preencha sua senha atual'),
  senhaNova: Yup.string()
    .min(6, 'A senha deve conter pelo menos 6 caracteres')
    .required('Preencha sua nova senha'),
  confirmarSenhaNova: Yup.string()
    .required('Confirme sua nova senha')
    .oneOf([Yup.ref('senhaNova')], 'As senhas devem ser iguais'),
})



export default validationSchema
