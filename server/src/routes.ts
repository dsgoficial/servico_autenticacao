// Path: routes.ts
import express, { Request, Response, Router, RequestHandler } from 'express';
import { databaseVersion } from './database/index.js';
import { HttpCode } from './utils/index.js';
import { loginRoute } from './login/index.js';
import { usuariosRoute } from './usuarios/index.js';
import { aplicacoesRoute } from './aplicacoes/index.js';
import { dashboardRoute } from './dashboard/index.js';

const router: Router = express.Router();

const rootHandler: RequestHandler = (_req: Request, res: Response): void => {
  res.sendJsonAndLog(true, 'Serviço de autenticação operacional', HttpCode.OK, {
    database_version: databaseVersion.nome,
  });
};

router.get('/', rootHandler);

router.use('/login', loginRoute);
router.use('/usuarios', usuariosRoute);
router.use('/aplicacoes', aplicacoesRoute);
router.use('/dashboard', dashboardRoute);

export default router;
