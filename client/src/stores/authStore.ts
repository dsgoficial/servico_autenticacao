// Path: stores\authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserRole, LoginResponse, LoginRequest } from '../types/auth';
import { login as loginApi } from '../services/authService';
import { signUp as signUpApi } from '../services/userService';
import { navigateToLogin } from '../routes';
import { tokenService } from '../services/tokenService';

// Define the AuthState interface
interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  // Actions
  login: (credentials: LoginRequest) => Promise<boolean>;
  signUp: (userData: {
    usuario: string;
    senha: string;
    nome: string;
    nomeGuerra: string;
    tipoPostoGradId: number;
    tipoTurnoId: number;
  }) => Promise<boolean>;
  setUser: (loginResponse: LoginResponse) => void;
  logout: () => void;
  getRole: () => UserRole | null;
  getUUID: () => string | null;
}

// Create the AuthStore with Zustand
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      // Actions
      login: async (credentials: LoginRequest) => {
        try {
          const response = await loginApi(credentials);

          if (response.success) {
            get().setUser({
              ...response.dados,
              username: credentials.usuario,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      signUp: async userData => {
        try {
          const response = await signUpApi(userData);
          return response.success;
        } catch (error) {
          console.error('SignUp error:', error);
          return false;
        }
      },

      setUser: (loginResponse: LoginResponse) => {
        const role = loginResponse.administrador
          ? UserRole.ADMIN
          : UserRole.USER;

        // Create user data object
        const userData = {
          uuid: loginResponse.uuid,
          role,
          token: loginResponse.token,
          username: loginResponse.username,
        };

        // Save to localStorage using token service
        tokenService.storeUserData(userData);

        // Update Zustand state
        set({
          user: userData,
          isAuthenticated: true,
          isAdmin: role === UserRole.ADMIN,
        });
      },

      logout: () => {
        // Clear localStorage using token service
        tokenService.clearUserData();

        // Reset Zustand state
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      getRole: () => get().user?.role || null,
      getUUID: () => get().user?.uuid || tokenService.getUserUUID(),
    }),
    {
      name: 'auth-storage',
      // Only persist these fields
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
      // Use a custom storage to handle JSON parsing/stringifying
      storage: createJSONStorage(() => localStorage),
      // Add an onRehydrate callback to check token expiration when store loads
      onRehydrateStorage: () => state => {
        // Check token expiration on rehydration
        try {
          if (
            state?.isAuthenticated &&
            tokenService.isTokenExpiredOrMissing()
          ) {
            // Clear the store if token is expired
            tokenService.clearUserData();
            // This will update the state after rehydration
            setTimeout(() => {
              const authStore = useAuthStore.getState();
              authStore.logout();
            }, 0);
          }
        } catch (error) {
          console.error('Error in rehydration:', error);
        }
      },
    },
  ),
);

// Selectors for performance optimization
export const selectIsAuthenticated = (state: AuthState) =>
  state.isAuthenticated;
export const selectIsAdmin = (state: AuthState) => state.isAdmin;
export const selectUser = (state: AuthState) => state.user;
export const selectUsername = (state: AuthState) => state.user?.username;

export const logoutAndRedirect = () => {
  // Get the logout function from the store
  const logout = useAuthStore.getState().logout;

  // Logout the user
  logout();

  navigateToLogin();
};
