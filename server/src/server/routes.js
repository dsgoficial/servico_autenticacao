'use strict'

const { loginRoute } = require('../login')
const { usuariosRoute } = require('../usuarios')
const { aplicacoesRoute } = require('../aplicacoes')
const { dashboardRoute } = require('../dashboard')

const routes = app => {
  app.use('/login', loginRoute)

  app.use('/usuarios', usuariosRoute)
  app.use('/aplicacoes', aplicacoesRoute)
  app.use('/dashboard', dashboardRoute)
}
module.exports = routes
