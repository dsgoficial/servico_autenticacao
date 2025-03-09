// Path: login\validate_token.ts
import jwt from 'jsonwebtoken';
import { AppError, HttpCode } from '../utils/index.js';
import config from '../config.js';
import { DecodedToken } from './login_types.js';

const { JWT_SECRET } = config;

const decodeJwt = (token: string, secret: string): Promise<DecodedToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(
          new AppError('Falha ao autenticar token', HttpCode.Unauthorized, err),
        );
      }
      resolve(decoded as DecodedToken);
    });
  });
};

const validateToken = async (token?: string): Promise<DecodedToken> => {
  if (!token) {
    throw new AppError('Nenhum token fornecido', HttpCode.Unauthorized);
  }

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7);
  }

  return decodeJwt(token, JWT_SECRET);
};

export default validateToken;
