import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import { auth } from './services'

import Cadastro from './Cadastro'
import Login from './Login'
import NaoEncontrado from './NaoEncontrado'
import Erro from './Erro'
import Dashboard from './Dashboard'

const PrivateRoute = ({ component: Component, role, ...rest }) => (
  <Route
    {...rest} render={props => {
      if (!auth.isAuthenticated()) {
        // not logged in so redirect to login page with the return url
        return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      }

      // check if route is restricted by role
      if (role && role !== auth.getAuthorization()) {
        // role not authorised so redirect to home page
        return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      }

      // authorised so return component
      return <Component {...props} />
    }}
  />
)

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute exact path='/' component={Dashboard} />
      <PrivateRoute exact path='/adm' role={auth.ROLES.Admin} component={() => <h1>Adm</h1>} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/cadastro' component={Cadastro} />
      <Route exact path='/erro' component={Erro} />
      <Route path='*' component={NaoEncontrado} />
    </Switch>
  </BrowserRouter>
)

export default Routes
