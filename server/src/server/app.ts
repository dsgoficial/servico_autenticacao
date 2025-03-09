// Path: server\app.ts
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import path from 'path';
import cors from 'cors';
import hpp from 'hpp';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import noCache from 'nocache';
import { fileURLToPath } from 'url';

import swaggerOptions from './swagger_options.js';
const swaggerSpec = swaggerJSDoc(swaggerOptions);

import {
  AppError,
  HttpCode,
  logger,
  errorHandler,
  sendJsonAndLogMiddleware,
} from '../utils/index.js';

import appRoutes from '../routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Add sendJsonAndLog to res object
app.use(sendJsonAndLogMiddleware);

app.use(express.json()); // parsear POST em JSON
app.use(hpp()); // protection against parameter polution

// CORS middleware
app.use(cors());

// Helmet Protection
// app.use(helmet());
app.use(noCache());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 200, // limite por minuto por IP
});

// apply limit all requests
app.use(limiter);

app.use((req: Request, _res: Response, next: NextFunction) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;

  logger.info(`${req.method} request`, {
    url,
    ip: req.ip,
  });
  return next();
});

// All routes used by the App
app.use('/api', appRoutes);

// Serve SwaggerDoc
app.use('/api/api_docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve JSDocs
app.use('/api/js_docs', express.static(path.join(__dirname, '..', 'js_docs')));

// Serve Client
app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  const err = new AppError(
    `URL não encontrada para o método ${req.method}`,
    HttpCode.NotFound,
  );
  return next(err);
});

// Error handling
const errorHandlerMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  return errorHandler.log(err as Error | AppError, res);
};

app.use(errorHandlerMiddleware);

export default app;
