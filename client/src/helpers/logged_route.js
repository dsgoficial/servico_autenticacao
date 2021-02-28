import React from "react";
import { Route, Redirect } from "react-router-dom";
import { auth } from "../services";

const LoggedRoute = ({ component: Component, exact, path, ...rest }) => (
  <Route
    {...rest}
    exact={exact}
    path={path}
    render={(props) => {
      if (auth.isAuthenticated()) {
        // not logged in so redirect to login page with the return url
        return (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        );
      }

      // authorised so return component
      return <Component {...props} />;
    }}
  />
);

export default LoggedRoute;