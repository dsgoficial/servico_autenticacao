// Path: login\login_schema.ts
import { z } from 'zod';

// Define Zod schemas
const login = z.object({
  usuario: z.string().min(1, 'Usuário é obrigatório'),
  senha: z.string().min(1, 'Senha é obrigatória'),
  aplicacao: z.string().min(1, 'Aplicação é obrigatória'),
});

// Infer TypeScript types from schemas
export type LoginRequest = z.infer<typeof login>;

// Export schemas
const schemas = {
  login,
};

export default schemas;
