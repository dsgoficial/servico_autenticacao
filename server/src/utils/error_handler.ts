// Path: utils\error_handler.ts
import { Response } from 'express';
import { serializeError } from 'serialize-error';
import logger from './logger.js';
import { HttpCode } from './http_code.js';
import { ErrorTrace } from './utils_types.js';
import AppError from './app_error.js';

interface ErrorHandlerInterface {
  log: (err: Error | AppError, res?: Response | null) => void;
  critical: (err: Error | AppError, res?: Response | null) => void;
}

class ErrorHandler implements ErrorHandlerInterface {
  log(err: Error | AppError, res: Response | null = null): void {
    const statusCode =
      'statusCode' in err ? err.statusCode : HttpCode.InternalError;
    const message = err.message || 'Erro no servidor';
    const errorTrace: ErrorTrace | null =
      'errorTrace' in err ? err.errorTrace : serializeError(err) || null;

    if (res && 'sendJsonAndLog' in res) {
      res.sendJsonAndLog(false, message, statusCode, null, errorTrace);
      return;
    }

    logger.error(message, {
      error: errorTrace,
      status: statusCode,
      success: false,
    });
  }

  critical(err: Error | AppError, res: Response | null = null): void {
    this.log(err, res);
    // Aguarda o flush dos transports (winston/DailyRotateFile é assíncrono)
    // antes de encerrar, para não perder o log crítico. O timer de 2s é um
    // fallback que garante o process.exit(1) caso o evento 'finish' não
    // dispare — por isso NÃO usamos unref(): o timer precisa manter o event
    // loop vivo até a saída, senão o processo poderia terminar com código 0.
    const exit = (): void => process.exit(1);
    const timer = setTimeout(exit, 2000);
    logger.on('finish', () => {
      clearTimeout(timer);
      exit();
    });
    logger.end();
  }
}

export default new ErrorHandler();
