import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { PrivateRoute } from './helpers'
import { ROLES } from './services'

import Cadastro from './Cadastro'
import Login from './Login'
import NaoEncontrado from './NaoEncontrado'
import Erro from './Erro'
import Dashboard from './Dashboard'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute exact path='/' component={Dashboard} />
      <PrivateRoute exact path='/adm' role={ROLES.Admin} component={() => <h1>Adm</h1>} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/cadastro' component={Cadastro} />
      <Route exact path='/erro' component={Erro} />
      <Route path='*' component={NaoEncontrado} />
    </Switch>
  </BrowserRouter>
)

export default Routes
