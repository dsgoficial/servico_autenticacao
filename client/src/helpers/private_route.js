import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { auth } from '../services'

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

export default PrivateRoute
