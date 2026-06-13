import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mockamos a borda de rede/navegação; o tokenService é real (usa o localStorage
// do jsdom), o que exercita a integração store <-> persistência.
vi.mock('../services/authService', () => ({ login: vi.fn() }));
vi.mock('../services/userService', () => ({ signUp: vi.fn() }));
vi.mock('../routes', () => ({ navigateToLogin: vi.fn() }));

import { useAuthStore } from './authStore';
import { login as loginApi } from '../services/authService';
import { UserRole } from '../types/auth';
import { tokenService } from '../services/tokenService';

const mockedLogin = vi.mocked(loginApi);

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ user: null, isAuthenticated: false, isAdmin: false });
  vi.clearAllMocks();
});

describe('setUser', () => {
  it('marca admin e persiste os dados no tokenService', () => {
    useAuthStore.getState().setUser({
      token: 'tok',
      administrador: true,
      uuid: 'abc',
      username: 'jsilva',
    });

    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(true);
    expect(s.isAdmin).toBe(true);
    expect(s.user).toMatchObject({
      uuid: 'abc',
      role: UserRole.ADMIN,
      token: 'tok',
      username: 'jsilva',
    });
    expect(tokenService.getToken()).toBe('tok');
    expect(tokenService.getUserUUID()).toBe('abc');
  });

  it('marca usuário comum (não-admin) corretamente', () => {
    useAuthStore
      .getState()
      .setUser({ token: 't', administrador: false, uuid: 'u' });
    const s = useAuthStore.getState();
    expect(s.isAdmin).toBe(false);
    expect(s.user?.role).toBe(UserRole.USER);
  });
});

describe('logout', () => {
  it('reseta o estado e limpa o tokenService', () => {
    useAuthStore
      .getState()
      .setUser({ token: 't', administrador: true, uuid: 'abc' });

    useAuthStore.getState().logout();

    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(false);
    expect(s.isAdmin).toBe(false);
    expect(s.user).toBeNull();
    expect(tokenService.getToken()).toBeNull();
  });
});

describe('getUUID', () => {
  it('vem do estado e cai para o tokenService após logout', () => {
    useAuthStore
      .getState()
      .setUser({ token: 't', administrador: false, uuid: 'abc' });
    expect(useAuthStore.getState().getUUID()).toBe('abc');

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().getUUID()).toBeNull();
  });
});

describe('login', () => {
  it('autentica e retorna true em caso de sucesso', async () => {
    mockedLogin.mockResolvedValueOnce({
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dados: { token: 'tok', administrador: false, uuid: 'x' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const ok = await useAuthStore
      .getState()
      .login({ usuario: 'u', senha: 'p' });

    expect(ok).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    // o username vem das credenciais informadas
    expect(useAuthStore.getState().user?.username).toBe('u');
  });

  it('retorna false quando a resposta não é success', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedLogin.mockResolvedValueOnce({ success: false } as any);
    const ok = await useAuthStore
      .getState()
      .login({ usuario: 'u', senha: 'p' });
    expect(ok).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('captura erros de rede e retorna false (sem quebrar)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedLogin.mockRejectedValueOnce(new Error('network down'));
    const ok = await useAuthStore
      .getState()
      .login({ usuario: 'u', senha: 'p' });
    expect(ok).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
