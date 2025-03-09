// Path: utils\app_error.ts
import { serializeError } from 'serialize-error';
import { HttpCode } from './http_code.js';
import { ErrorTrace } from './utils_types.js';

class AppError extends Error {
  statusCode: number;
  errorTrace: ErrorTrace | null;

  constructor(
    message: string,
    status: number = HttpCode.InternalError,
    errorTrace: Error | ErrorTrace | null = null,
  ) {
    super(message);
    this.statusCode = status;
    this.errorTrace =
      errorTrace instanceof Error ? serializeError(errorTrace) : errorTrace;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;
