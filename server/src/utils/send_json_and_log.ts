// Path: utils\send_json_and_log.ts
import { Request, Response, NextFunction } from 'express';
import logger from './logger.js';
import { VERSION } from '../config.js';
import { JsonResponse, ErrorTrace } from './utils_types.js';

declare global {
  namespace Express {
    interface Response {
      sendJsonAndLog: (
        success: boolean,
        message: string,
        status: number,
        dados?: any,
        error?: ErrorTrace | null,
        metadata?: Record<string, any>,
      ) => Response;
    }
  }
}

const truncate = (dados: any): void => {
  if (!dados) return;

  if ('senha' in dados) {
    dados.senha = '*';
  }

  const MAX_LENGTH = 500;

  for (const key in dados) {
    if (Object.prototype.toString.call(dados[key]) === '[object String]') {
      if (dados[key].length > MAX_LENGTH) {
        dados[key] = dados[key].substring(0, MAX_LENGTH);
      }
    }
  }
};

const sendJsonAndLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.sendJsonAndLog = (
    success: boolean,
    message: string,
    status: number,
    dados: any = null,
    error: ErrorTrace | null = null,
    metadata: Record<string, any> = {},
  ): Response => {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const bodyToLog = { ...req.body };

    truncate(bodyToLog);

    logger.info(message, {
      url,
      information: bodyToLog,
      status,
      success,
      error,
    });

    const userMessage = status === 500 ? 'Erro no servidor' : message;
    const jsonData: JsonResponse = {
      version: VERSION,
      success: success,
      message: userMessage,
      dados,
      ...metadata,
    };

    return res.status(status).json(jsonData);
  };

  next();
};

export default sendJsonAndLogMiddleware;
