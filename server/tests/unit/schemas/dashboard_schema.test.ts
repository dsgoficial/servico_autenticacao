import { describe, it, expect } from 'vitest';
import schemas from '../../../src/dashboard/dashboard_schema.js';

const { totalQuery, totalMaxQuery } = schemas;

describe('dashboard_schema.totalQuery', () => {
  it('aceita ausência de total (parâmetro opcional)', () => {
    const r = totalQuery.safeParse({});
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.total).toBeUndefined();
  });

  it('converte string numérica válida para number', () => {
    const r = totalQuery.safeParse({ total: '14' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.total).toBe(14);
  });

  it('aceita o limite superior 366', () => {
    expect(totalQuery.safeParse({ total: '366' }).success).toBe(true);
  });

  // Regressão (bug #2): sem teto, total enorme materializava bilhões de linhas
  // no generate_series. O schema agora rejeita acima de 366.
  it('REGRESSÃO: rejeita total acima de 366', () => {
    expect(totalQuery.safeParse({ total: '367' }).success).toBe(false);
    expect(totalQuery.safeParse({ total: '1000000000' }).success).toBe(false);
  });

  // Regressão (bug #2): floats viravam interval '0.5 day', sem sentido.
  it('REGRESSÃO: rejeita números não-inteiros', () => {
    expect(totalQuery.safeParse({ total: '1.5' }).success).toBe(false);
  });

  it('rejeita zero, negativos e não-numéricos', () => {
    expect(totalQuery.safeParse({ total: '0' }).success).toBe(false);
    expect(totalQuery.safeParse({ total: '-5' }).success).toBe(false);
    expect(totalQuery.safeParse({ total: 'abc' }).success).toBe(false);
  });
});

describe('dashboard_schema.totalMaxQuery', () => {
  it('aceita total e max válidos', () => {
    const r = totalMaxQuery.safeParse({ total: '10', max: '100' });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.total).toBe(10);
      expect(r.data.max).toBe(100);
    }
  });

  it('aceita o limite superior 100 para max', () => {
    expect(totalMaxQuery.safeParse({ max: '100' }).success).toBe(true);
  });

  it('REGRESSÃO: rejeita max acima de 100 e não-inteiro', () => {
    expect(totalMaxQuery.safeParse({ max: '101' }).success).toBe(false);
    expect(totalMaxQuery.safeParse({ max: '2.5' }).success).toBe(false);
  });

  it('rejeita max zero ou negativo', () => {
    expect(totalMaxQuery.safeParse({ max: '0' }).success).toBe(false);
    expect(totalMaxQuery.safeParse({ max: '-1' }).success).toBe(false);
  });
});
