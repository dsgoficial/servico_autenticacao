// Path: usuarios\usuario_route.ts
import express, { Request, Response } from 'express';
import { schemaValidation, asyncHandler, HttpCode } from '../utils/index.js';
import { verifyLogin, verifyAdmin } from '../login/index.js';
import usuarioCtrl from './usuario_ctrl.js';
import usuarioSchema from './usuario_schema.js';
import {
  ListaUsuariosRequest,
  CreateUsuarioRequest,
  CreateUsuarioCompletoRequest,
  UpdateUsuarioCompletoRequest,
  UpdateUsuarioRequest,
  UpdateSenhaRequest,
  UuidParams,
  AtivoParams,
} from './usuario_schema.js';

const router = express.Router();

router.post(
  '/senha/resetar',
  verifyAdmin,
  schemaValidation({ body: usuarioSchema.listaUsuarios }),
  asyncHandler(
    async (req: Request<{}, {}, ListaUsuariosRequest>, res: Response) => {
      await usuarioCtrl.resetaSenhaUsuarios(req.body.usuarios_uuids);
      const msg = 'Senha resetada com sucesso';
      return res.sendJsonAndLog(true, msg, HttpCode.OK);
    },
  ),
);

router.post(
  '/autorizacao/:ativo',
  verifyAdmin,
  schemaValidation({
    body: usuarioSchema.listaUsuarios,
    params: usuarioSchema.ativoParams,
  }),
  asyncHandler(
    async (
      req: Request<AtivoParams, {}, ListaUsuariosRequest>,
      res: Response,
    ) => {
      await usuarioCtrl.modificaAutorizacao(
        req.body.usuarios_uuids,
        req.params.ativo === 'true',
      );
      const msg = 'Autorização atualizada com sucesso';
      return res.sendJsonAndLog(true, msg, HttpCode.OK);
    },
  ),
);

router.get(
  '/tipo_posto_grad',
  asyncHandler(async (_req: Request, res: Response) => {
    const dados = await usuarioCtrl.getTipoPostoGrad();
    const msg = 'Tipos de Posto e Graduação retornados com sucesso';
    return res.sendJsonAndLog(true, msg, HttpCode.OK, dados);
  }),
);

router.get(
  '/tipo_turno',
  asyncHandler(async (_req: Request, res: Response) => {
    const dados = await usuarioCtrl.getTipoTurno();
    const msg = 'Tipos de Turno retornados com sucesso';
    return res.sendJsonAndLog(true, msg, HttpCode.OK, dados);
  }),
);

router.get(
  '/completo',
  verifyAdmin,
  asyncHandler(async (_req: Request, res: Response) => {
    const dados = await usuarioCtrl.getUsuariosCompleto();
    const msg = 'Usuários retornados com sucesso';
    return res.sendJsonAndLog(true, msg, HttpCode.OK, dados);
  }),
);

router.post(
  '/completo',
  verifyAdmin,
  schemaValidation({ body: usuarioSchema.criacaoUsuarioCompleto }),
  asyncHandler(
    async (
      req: Request<{}, {}, CreateUsuarioCompletoRequest>,
      res: Response,
    ) => {
      await usuarioCtrl.criaUsuarioCompleto(
        req.body.usuario,
        req.body.senha,
        req.body.nome,
        req.body.nome_guerra,
        req.body.tipo_posto_grad_id,
        req.body.tipo_turno_id,
        req.body.ativo,
        req.body.administrador,
        req.body.uuid,
      );
      const msg = 'Usuário criado com sucesso';
      return res.sendJsonAndLog(true, msg, HttpCode.OK);
    },
  ),
);

router.put(
  '/completo/:usuario_uuid',
  schemaValidation({
    body: usuarioSchema.atualizacaoUsuarioCompleto,
    params: usuarioSchema.uuidParams,
  }),
  verifyAdmin,
  asyncHandler(
    async (
      req: Request<UuidParams, {}, UpdateUsuarioCompletoRequest>,
      res: Response,
    ) => {
      await usuarioCtrl.updateUsuarioCompleto(
        req.params.usuario_uuid,
        req.body.usuario,
        req.body.nome,
        req.body.nome_guerra,
        req.body.tipo_posto_grad_id,
        req.body.tipo_turno_id,
        req.body.ativo,
        req.body.administrador,
        req.body.uuid,
      );
      const msg = 'Usuário atualizado com sucesso';
      return res.sendJsonAndLog(true, msg, HttpCode.OK);
    },
  ),
);

router.put(
  '/:usuario_uuid/senha',
  schemaValidation({
    body: usuarioSchema.atualizacaoSenha,
    params: usuarioSchema.uuidParams,
  }),
  verifyLogin,
  asyncHandler(
    async (req: Request<UuidParams, {}, UpdateSenhaRequest>, res: Response) => {
      await usuarioCtrl.updateSenha(
        req.params.usuario_uuid,
        req.body.senha_atual,
        req.body.senha_nova,
      );
      const msg = 'Senha do usuário atualizada com sucesso';
      return res.sendJsonAndLog(true, msg, HttpCode.OK);
    },
  ),
);

router.put(
  '/:usuario_uuid',
  schemaValidation({
    body: usuarioSchema.atualizacaoUsuario,
    params: usuarioSchema.uuidParams,
  }),
  verifyLogin,
  asyncHandler(
    async (
      req: Request<UuidParams, {}, UpdateUsuarioRequest>,
      res: Response,
    ) => {
      await usuarioCtrl.updateUsuario(
        req.params.usuario_uuid,
        req.body.nome,
        req.body.nome_guerra,
        req.body.tipo_posto_grad_id,
        req.body.tipo_turno_id,
      );
      const msg = 'Usuário atualizado com sucesso';
      return res.sendJsonAndLog(true, msg, HttpCode.OK);
    },
  ),
);

router.delete(
  '/:usuario_uuid',
  schemaValidation({
    params: usuarioSchema.uuidParams,
  }),
  verifyAdmin,
  asyncHandler(async (req: Request<UuidParams>, res: Response) => {
    await usuarioCtrl.deletaUsuario(req.params.usuario_uuid);
    const msg = 'Usuário deletado com sucesso';
    return res.sendJsonAndLog(true, msg, HttpCode.OK);
  }),
);

router.get(
  '/:usuario_uuid',
  schemaValidation({
    params: usuarioSchema.uuidParams,
  }),
  asyncHandler(async (req: Request<UuidParams>, res: Response) => {
    const dados = await usuarioCtrl.getUsuario(req.params.usuario_uuid);
    const msg = 'Usuário retornado com sucesso';
    return res.sendJsonAndLog(true, msg, HttpCode.OK, dados);
  }),
);

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const dados = await usuarioCtrl.getUsuarios();
    const msg = 'Usuários retornados com sucesso';
    return res.sendJsonAndLog(true, msg, HttpCode.OK, dados);
  }),
);

router.post(
  '/',
  schemaValidation({ body: usuarioSchema.criacaoUsuario }),
  asyncHandler(
    async (req: Request<{}, {}, CreateUsuarioRequest>, res: Response) => {
      await usuarioCtrl.criaUsuario(
        req.body.usuario,
        req.body.senha,
        req.body.nome,
        req.body.nome_guerra,
        req.body.tipo_posto_grad_id,
        req.body.tipo_turno_id,
      );
      const msg = 'Usuário criado com sucesso';
      return res.sendJsonAndLog(true, msg, HttpCode.Created);
    },
  ),
);

export default router;
