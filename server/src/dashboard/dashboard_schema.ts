// Path: dashboard\dashboard_schema.ts
import { z } from 'zod';

// Define Zod schemas
const totalQuery = z.object({
  total: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined))
    .refine(val => val === undefined || (!isNaN(val) && val > 0), {
      message: 'Total must be a positive number',
    }),
});

const totalMaxQuery = z.object({
  total: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined))
    .refine(val => val === undefined || (!isNaN(val) && val > 0), {
      message: 'Total must be a positive number',
    }),
  max: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined))
    .refine(val => val === undefined || (!isNaN(val) && val > 0), {
      message: 'Max must be a positive number',
    }),
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
