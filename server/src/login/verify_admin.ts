// Path: login\verify_admin.ts
import { Response, NextFunction } from 'express';
import { AppError, asyncHandler, HttpCode } from '../utils/index.js';
import { db } from '../database/index.js';
import validateToken from './validate_token.js';
import { SQL } from './login_sql.js';
import { RequestWithUser } from './login_types.js';

// middleware para verificar se o usuário é administrador
const verifyAdmin = asyncHandler(
  async (req: RequestWithUser, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    const decoded = await validateToken(token);

    if (!decoded.uuid) {
      throw new AppError('Falta informação de usuário');
    }

    const response = await db.conn.oneOrNone<{ administrador: boolean }>(
      SQL.CHECK_ADMIN,
      { usuarioUuid: decoded.uuid },
    );

    if (!response?.administrador) {
      throw new AppError(
        'Usuário necessita ser um administrador',
        HttpCode.Forbidden,
      );
    }

    req.usuarioUuid = decoded.uuid;
    req.usuarioId = decoded.id;
    req.administrador = true;

    next();
  },
);

export default verifyAdmin;
