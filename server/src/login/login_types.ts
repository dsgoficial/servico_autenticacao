// Path: login\login_types.ts
import { Request } from 'express';

export interface LoginResult {
  token: string;
  administrador: boolean;
  uuid: string;
}

export interface DecodedToken {
  id: number;
  uuid: string;
  administrador: boolean;
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  usuarioUuid?: string;
  usuarioId?: number;
  administrador?: boolean;
}
