// Path: utils\parse_id.ts
import { AppError, HttpCode } from './index.js';

/**
 * Parse and validate ID from request parameters
 * @param id String value to parse as ID
 * @returns Parsed integer ID
 * @throws AppError if ID is missing or invalid
 */
export function parseId(id: string | undefined): number {
  if (!id) {
    throw new AppError('ID parameter is required', HttpCode.BadRequest);
  }

  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw new AppError('Invalid ID format', HttpCode.BadRequest);
  }

  return parsedId;
}
