import * as Yup from 'yup'

const usuarioSchema = Yup.object().shape({
  uuid: Yup.string(),
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
  ativo: Yup.boolean(),
  administrador: Yup.boolean()
})

export { usuarioSchema }
