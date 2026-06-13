import { describe, it, expect } from 'vitest';
import { standardizeError, createQueryKey } from './queryClient';

describe('standardizeError', () => {
  it('repassa objetos que já têm "message"', () => {
    const err = { message: 'Falhou', status: 404 };
    expect(standardizeError(err)).toBe(err);
  });

  it('extrai a mensagem de instâncias de Error', () => {
    // Error tem "message", então cai no 1º ramo e é repassado como ApiError.
    const result = standardizeError(new Error('boom'));
    expect(result.message).toBe('boom');
  });

  it('usa mensagem genérica para valores sem "message"', () => {
    expect(standardizeError('boom')).toEqual({
      message: 'An unexpected error occurred',
      status: undefined,
    });
    expect(standardizeError(null)).toEqual({
      message: 'An unexpected error occurred',
      status: undefined,
    });
    expect(standardizeError({})).toEqual({
      message: 'An unexpected error occurred',
      status: undefined,
    });
  });
});

describe('createQueryKey', () => {
  it('monta chaves com entidade, id e sub-recurso', () => {
    expect(createQueryKey('users')).toEqual(['users']);
    expect(createQueryKey('users', 5)).toEqual(['users', 5]);
    expect(createQueryKey('users', 5, 'profile')).toEqual([
      'users',
      5,
      'profile',
    ]);
  });

  it('pula o id quando undefined, mas mantém o sub-recurso', () => {
    expect(createQueryKey('users', undefined, 'profile')).toEqual([
      'users',
      'profile',
    ]);
  });
});
