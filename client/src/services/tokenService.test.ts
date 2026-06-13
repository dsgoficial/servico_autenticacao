import { describe, it, expect, beforeEach } from 'vitest';
import { tokenService } from './tokenService';

beforeEach(() => {
  localStorage.clear();
});

describe('tokenService.storeUserData / clearUserData', () => {
  it('grava token, papel, uuid, nome e expiração ~24h no futuro', () => {
    tokenService.storeUserData({
      token: 'tok',
      role: 'ADMIN',
      uuid: 'abc',
      username: 'jsilva',
    });

    expect(tokenService.getToken()).toBe('tok');
    expect(tokenService.getUserRole()).toBe('ADMIN');
    expect(tokenService.getUserUUID()).toBe('abc');
    expect(tokenService.getUserName()).toBe('jsilva');

    const expiry = tokenService.getTokenExpiry();
    expect(expiry).not.toBeNull();
    expect(new Date(expiry as string).getTime()).toBeGreaterThan(Date.now());
  });

  it('clearUserData remove todas as chaves', () => {
    tokenService.storeUserData({ token: 't', role: 'USER', uuid: 'u' });
    tokenService.clearUserData();

    expect(tokenService.getToken()).toBeNull();
    expect(tokenService.getTokenExpiry()).toBeNull();
    expect(tokenService.getUserRole()).toBeNull();
    expect(tokenService.getUserUUID()).toBeNull();
    expect(tokenService.getUserName()).toBeNull();
  });
});

describe('tokenService.isTokenExpiredOrMissing', () => {
  it('é true quando não há token', () => {
    expect(tokenService.isTokenExpiredOrMissing()).toBe(true);
  });

  it('é true quando há token mas não há expiração', () => {
    tokenService.setToken('tok');
    expect(tokenService.isTokenExpiredOrMissing()).toBe(true);
  });

  it('é true quando a expiração já passou', () => {
    tokenService.setToken('tok');
    tokenService.setTokenExpiry(new Date(Date.now() - 60_000));
    expect(tokenService.isTokenExpiredOrMissing()).toBe(true);
  });

  it('é false quando há token e expiração no futuro', () => {
    tokenService.setToken('tok');
    tokenService.setTokenExpiry(new Date(Date.now() + 60_000));
    expect(tokenService.isTokenExpiredOrMissing()).toBe(false);
  });

  it('é false logo após storeUserData (expiração de 24h)', () => {
    tokenService.storeUserData({ token: 't', role: 'USER', uuid: 'u' });
    expect(tokenService.isTokenExpiredOrMissing()).toBe(false);
  });
});
