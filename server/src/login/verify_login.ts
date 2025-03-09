// Path: login\verify_login.ts
import { Response, NextFunction } from 'express';
import { AppError, asyncHandler, HttpCode } from '../utils/index.js';
import { db } from '../database/index.js';
import validateToken from './validate_token.js';
import { SQL } from './login_sql.js';
import { RequestWithUser } from './login_types.js';

// middleware para verificar o JWT
const verifyLogin = asyncHandler(
  async (req: RequestWithUser, _res: Response, next: NextFunction) => {
    // verifica o header authorization para pegar o token
    const token = req.headers.authorization;

    const decoded = await validateToken(token);

    if (!decoded.uuid) {
      throw new AppError('Falta informação de usuário');
    }

    if (req.params.usuario_uuid && decoded.uuid !== req.params.usuario_uuid) {
      throw new AppError(
        'Usuário só pode acessar sua própria informação',
        HttpCode.Unauthorized,
      );
    }

    const response = await db.conn.oneOrNone<{ ativo: boolean }>(
      SQL.CHECK_ACTIVE,
      { usuarioUuid: decoded.uuid },
    );

    if (!response?.ativo) {
      throw new AppError('Usuário não está ativo', HttpCode.Forbidden);
    }

    req.usuarioUuid = decoded.uuid;
    req.usuarioId = decoded.id;

    next();
  },
);

export default verifyLogin;
