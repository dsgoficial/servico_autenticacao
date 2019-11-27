"use strict";

const { AppError, asyncHandler, httpCode } = require("../utils");

//middleware para verificar se o usuário é administrador
const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (!("usuarioUuid" in req.body && req.body.usuarioUuid)) {
    throw new AppError("Falta informação de usuário");
  }
  const {
    administrador
  } = await db.oneOrNone(
    `SELECT administrador FROM dgeo.usuario WHERE uuid = $<usuarioUuid> and ativo IS TRUE`,
    { usuarioUuid: req.body.usuarioUuid }
  );
  if (!administrador) {
    throw new AppError(
      "Usuário necessita ser um administrador",
      httpCode.Forbidden
    );
  }
  next();
});

module.exports = verifyAdmin;
