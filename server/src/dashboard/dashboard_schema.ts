// Path: dashboard\dashboard_schema.ts
import { z } from 'zod';

// Define Zod schemas
const totalQuery = z.object({
  total: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined))
    .refine(
      val =>
        val === undefined || (Number.isInteger(val) && val > 0 && val <= 366),
      { message: 'Total must be a positive integer up to 366' },
    ),
});

const totalMaxQuery = z.object({
  total: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined))
    .refine(
      val =>
        val === undefined || (Number.isInteger(val) && val > 0 && val <= 366),
      { message: 'Total must be a positive integer up to 366' },
    ),
  max: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined))
    .refine(
      val =>
        val === undefined || (Number.isInteger(val) && val > 0 && val <= 100),
      { message: 'Max must be a positive integer up to 100' },
    ),
});

// Infer TypeScript types from schemas
export type TotalQuery = z.infer<typeof totalQuery>;
export type TotalMaxQuery = z.infer<typeof totalMaxQuery>;

// Export schemas
const schemas = {
  totalQuery,
  totalMaxQuery,
};

export default schemas;
