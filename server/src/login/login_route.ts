// Path: login\login_route.ts
import express, { Request, Response } from 'express';
import { schemaValidation, asyncHandler, HttpCode } from '../utils/index.js';
import loginCtrl from './login_ctrl.js';
import loginSchema from './login_schema.js';
import { LoginRequest } from './login_schema.js';

const router = express.Router();

router.post(
  '/',
  schemaValidation({ body: loginSchema.login }),
  asyncHandler(async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    const dados = await loginCtrl.login(
      req.body.usuario,
      req.body.senha,
      req.body.aplicacao,
    );

    return res.sendJsonAndLog(
      true,
      'Usuário autenticado com sucesso',
      HttpCode.Created,
      dados,
    );
  }),
);

export default router;
