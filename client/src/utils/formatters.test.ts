import { describe, it, expect, vi } from 'vitest';
import { formatDate } from './formatters';

describe('formatDate', () => {
  it('retorna string vazia para entradas vazias/nulas', () => {
    expect(formatDate()).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate('')).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('formata um Date em pt-BR (DD/MM/YYYY) — independente de fuso', () => {
    // Date construído com componentes locais para não depender do timezone do
    // runner.
    const d = new Date(2024, 0, 15);
    expect(
      formatDate(d, { day: '2-digit', month: '2-digit', year: 'numeric' }),
    ).toBe('15/01/2024');
  });

  it('NÃO lança e retorna string vazia para data inválida', () => {
    // o formatDate registra o erro via console.error; silenciamos o ruído
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(formatDate('isto-nao-e-data')).toBe('');
    spy.mockRestore();
  });
});
