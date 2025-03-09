// Path: usuarios\usuario_schema.ts
import { z } from 'zod';

const uuidParams = z.object({
  usuario_uuid: z.string().uuid('UUID inválido'),
});

const ativoParams = z.object({
  ativo: z.enum(['true', 'false'], {
    errorMap: () => ({ message: 'O valor deve ser "true" ou "false"' }),
  }),
});

const listaUsuarios = z.object({
  usuarios_uuids: z
    .array(z.string().uuid('UUID inválido'))
    .min(1, 'Deve conter pelo menos um UUID')
    .refine(arr => new Set(arr).size === arr.length, {
      message: 'Não deve conter UUIDs duplicados',
    }),
});

const criacaoUsuario = z.object({
  usuario: z.string().min(1, 'Usuário é obrigatório'),
  senha: z.string().min(1, 'Senha é obrigatória'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  nome_guerra: z.string().min(1, 'Nome de guerra é obrigatório'),
  tipo_posto_grad_id: z
    .number()
    .int()
    .positive('Deve ser um número inteiro positivo'),
  tipo_turno_id: z
    .number()
    .int()
    .positive('Deve ser um número inteiro positivo'),
});

const criacaoUsuarioCompleto = criacaoUsuario.extend({
  uuid: z.string().uuid('UUID inválido').optional(),
  administrador: z.boolean(),
  ativo: z.boolean(),
});

const atualizacaoUsuarioCompleto = z.object({
  uuid: z.string().uuid('UUID inválido'),
  usuario: z.string().min(1, 'Usuário é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  nome_guerra: z.string().min(1, 'Nome de guerra é obrigatório'),
  tipo_posto_grad_id: z
    .number()
    .int()
    .positive('Deve ser um número inteiro positivo'),
  tipo_turno_id: z
    .number()
    .int()
    .positive('Deve ser um número inteiro positivo'),
  administrador: z.boolean(),
  ativo: z.boolean(),
});

const atualizacaoUsuario = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  nome_guerra: z.string().min(1, 'Nome de guerra é obrigatório'),
  tipo_posto_grad_id: z
    .number()
    .int()
    .positive('Deve ser um número inteiro positivo'),
  tipo_turno_id: z
    .number()
    .int()
    .positive('Deve ser um número inteiro positivo'),
});

const atualizacaoSenha = z.object({
  senha_atual: z.string().min(1, 'Senha atual é obrigatória'),
  senha_nova: z.string().min(1, 'Nova senha é obrigatória'),
});

// Infer TypeScript types from schemas
export type UuidParams = z.infer<typeof uuidParams>;
export type AtivoParams = z.infer<typeof ativoParams>;
export type ListaUsuariosRequest = z.infer<typeof listaUsuarios>;
export type CreateUsuarioRequest = z.infer<typeof criacaoUsuario>;
export type CreateUsuarioCompletoRequest = z.infer<
  typeof criacaoUsuarioCompleto
>;
export type UpdateUsuarioCompletoRequest = z.infer<
  typeof atualizacaoUsuarioCompleto
>;
export type UpdateUsuarioRequest = z.infer<typeof atualizacaoUsuario>;
export type UpdateSenhaRequest = z.infer<typeof atualizacaoSenha>;

// Export schemas
const schemas = {
  uuidParams,
  ativoParams,
  listaUsuarios,
  criacaoUsuario,
  criacaoUsuarioCompleto,
  atualizacaoUsuarioCompleto,
  atualizacaoUsuario,
  atualizacaoSenha,
};

export default schemas;
