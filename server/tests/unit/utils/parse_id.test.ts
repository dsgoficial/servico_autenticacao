import { describe, it, expect } from 'vitest';
import { parseId } from '../../../src/utils/parse_id.js';
import { HttpCode } from '../../../src/utils/http_code.js';

describe('parseId', () => {
  it('converte string numérica em inteiro', () => {
    expect(parseId('42')).toBe(42);
    expect(parseId('0')).toBe(0);
  });

  it('lança 400 quando o id está ausente', () => {
    expect(() => parseId(undefined)).toThrow(/required/i);
    try {
      parseId(undefined);
    } catch (e) {
      expect((e as { statusCode: number }).statusCode).toBe(HttpCode.BadRequest);
    }
  });

  it('lança 400 para id não-numérico', () => {
    expect(() => parseId('abc')).toThrow(/invalid/i);
    try {
      parseId('abc');
    } catch (e) {
      expect((e as { statusCode: number }).statusCode).toBe(HttpCode.BadRequest);
    }
  });

  // LACUNA CONHECIDA: parseInt é leniente e aceita prefixos numéricos. Hoje
  // parseId('12abc') retorna 12 em vez de rejeitar. O teste documenta o
  // comportamento atual; se um dia a validação ficar estrita, troque para
  // `expect(() => parseId('12abc')).toThrow()`.
  it('documenta a leniência do parseInt com sufixo não-numérico', () => {
    expect(parseId('12abc')).toBe(12);
  });
});
