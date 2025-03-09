// Path: utils\schema_validation.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError, HttpCode } from './index.js';

interface SchemaOptions {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/**
 * Creates detailed error message from ZodError
 */
const formatZodError = (error: ZodError): string => {
  return error.errors
    .map(err => {
      const path = err.path.join('.');
      return `${path}: ${err.message}`;
    })
    .join(', ');
};

/**
 * Middleware factory for Zod schema validation
 */
const schemaValidation = ({ body, query, params }: SchemaOptions) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Validate query parameters if schema provided
      if (query) {
        req.query = query.parse(req.query);
      }

      // Validate URL parameters if schema provided
      if (params) {
        req.params = params.parse(req.params);
      }

      // Validate request body if schema provided
      if (body) {
        req.body = body.parse(req.body);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationContext =
          body &&
          error.errors.some(e => e.path[0] && req.body && e.path[0] in req.body)
            ? 'Dados'
            : query &&
                error.errors.some(
                  e => e.path[0] && req.query && e.path[0] in req.query,
                )
              ? 'Query'
              : 'Parâmetros';

        const errorMessage = formatZodError(error);

        next(
          new AppError(
            `Erro de validação dos ${validationContext}. Mensagem de erro: ${errorMessage}`,
            HttpCode.BadRequest,
            error,
          ),
        );
      } else {
        next(error);
      }
    }
  };
};

export default schemaValidation;
