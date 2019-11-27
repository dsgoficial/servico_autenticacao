"use strict";

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config");

const { AppError, asyncHandler, httpCode } = require("../utils");

const decodeJwt = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(
          new AppError("Falha ao autenticar token", httpCode.BadRequest, err)
        );
      }
      resolve(decoded);
    });
  });
};

//middleware para verificar o JWT
const verifyLogin = asyncHandler(async (usuarioUuid) =>{
  return async (req, res, next) => {
    //verifica o header authorization para pegar o token
    const token = req.headers["authorization"];

    if (!token) {
      throw new AppError("Nenhum token fornecido", httpCode.Unauthorized);
    }
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    const decoded = await decodeJwt(token, JWT_SECRET);

    if(decoded.uuid != usuarioUuid){
      throw new AppError("Usuário só pode acessar sua própria informação", httpCode.Unauthorized);
    }

    req.body.usuarioUuid = decoded.id;
    next();
  }
});

module.exports = verifyLogin;
