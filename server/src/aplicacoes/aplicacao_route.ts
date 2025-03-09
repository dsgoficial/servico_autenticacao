// Path: aplicacoes\aplicacao_route.ts
import express from 'express';
import {
  schemaValidation,
  asyncHandler,
  HttpCode,
  parseId,
} from '../utils/index.js';
import { verifyAdmin } from '../login/index.js';

import aplicacaoCtrl from './aplicacao_ctrl.js';
import aplicacaoSchema from './aplicacao_schema.js';
import { AplicacaoInput } from './aplicacao_schema.js';

const router = express.Router();

router.put(
  '/:id',
  schemaValidation({
    body: aplicacaoSchema.aplicacao,
    params: aplicacaoSchema.idParams,
  }),
  verifyAdmin,
  asyncHandler<{ id: string }, {}, AplicacaoInput>(async (req, res) => {
    const id = parseId(req.params.id);

    await aplicacaoCtrl.updateAplicacao(
      id,
      req.body.nome,
      req.body.nome_abrev,
      req.body.ativa,
    );

    const msg = 'Aplicação atualizada com sucesso';

    return res.sendJsonAndLog(true, msg, HttpCode.OK);
  }),
);

router.delete(
  '/:id',
  schemaValidation({
    params: aplicacaoSchema.idParams,
  }),
  verifyAdmin,
  asyncHandler<{ id: string }>(async (req, res) => {
    const id = parseId(req.params.id);

    await aplicacaoCtrl.deletaAplicacao(id);

    const msg = 'Aplicação deletada com sucesso';

    return res.sendJsonAndLog(true, msg, HttpCode.OK);
  }),
);

router.get(
  '/',
  verifyAdmin,
  asyncHandler(async (_req, res) => {
    const dados = await aplicacaoCtrl.getAplicacao();

    const msg = 'Aplicações retornadas com sucesso';

    return res.sendJsonAndLog(true, msg, HttpCode.OK, dados);
  }),
);

router.post(
  '/',
  verifyAdmin,
  schemaValidation({ body: aplicacaoSchema.aplicacao }),
  asyncHandler<{}, {}, AplicacaoInput>(async (req, res) => {
    await aplicacaoCtrl.criaAplicacao(
      req.body.nome,
      req.body.nome_abrev,
      req.body.ativa,
    );
    const msg = 'Aplicação adicionada com sucesso';

    return res.sendJsonAndLog(true, msg, HttpCode.Created);
  }),
);

export default router;
