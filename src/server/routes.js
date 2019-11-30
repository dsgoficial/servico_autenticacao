"use strict";

const { loginRoute } = require("../login");
const { usuariosRoute } = require("../usuarios");

const routes = app => {
  app.use("/login", loginRoute);

  app.use("/usuarios", usuariosRoute);
};
module.exports = routes;
