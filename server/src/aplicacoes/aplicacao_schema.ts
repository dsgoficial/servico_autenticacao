// Path: aplicacoes\aplicacao_schema.ts
import { z } from 'zod';

// Define Zod schemas
const idParams = z.object({
  id: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'ID must be a positive number',
  }),
});

const aplicacao = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  nome_abrev: z.string().min(1, 'Nome abreviado é obrigatório'),
  ativa: z.boolean(),
});

// Infer TypeScript types from schemas
export type AplicacaoInput = z.infer<typeof aplicacao>;

// Export schemas
const schemas = {
  idParams,
  aplicacao,
};

export default schemas;
