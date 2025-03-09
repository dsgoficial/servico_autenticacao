// Path: services\tokenService.ts

// Storage keys for localStorage
const STORAGE_KEYS = {
  TOKEN: '@authserver-Token',
  USER_AUTHORIZATION: '@authserver-User-Authorization',
  USER_UUID: '@authserver-User-uuid',
  USER_NAME: '@authserver-User-username',
  TOKEN_EXPIRY: '@authserver-Token-Expiry',
} as const;

/**
 * Token service - centralized management of authentication tokens and user data
 */
export const tokenService = {
  // Token management
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // Token expiration
  getTokenExpiry: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
  },

  setTokenExpiry: (expiryTime: Date): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toISOString());
  },

  removeTokenExpiry: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  },

  /**
   * Check if token is expired or doesn't exist
   * @returns true if token is expired or doesn't exist, false otherwise
   */
  isTokenExpiredOrMissing: (): boolean => {
    const token = tokenService.getToken();
    if (!token) return true; // No token means effectively expired/invalid auth

    const expiry = tokenService.getTokenExpiry();
    if (!expiry) return true; // No expiry means we can't verify, consider expired

    try {
      const expiryTime = new Date(expiry);
      return expiryTime <= new Date();
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; // In case of error, consider token expired for security
    }
  },

  // User data management
  getUserRole: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER_AUTHORIZATION);
  },

  setUserRole: (role: string): void => {
    localStorage.setItem(STORAGE_KEYS.USER_AUTHORIZATION, role);
  },

  removeUserRole: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_AUTHORIZATION);
  },

  getUserUUID: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER_UUID);
  },

  setUserUUID: (uuid: string): void => {
    localStorage.setItem(STORAGE_KEYS.USER_UUID, uuid);
  },

  removeUserUUID: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_UUID);
  },

  getUserName: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER_NAME);
  },

  setUserName: (name: string): void => {
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  },

  removeUserName: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
  },

  // Store all user data
  storeUserData: (userData: {
    token: string;
    role: string;
    uuid: string;
    username?: string;
  }): void => {
    // Set token with 24-hour expiration
    tokenService.setToken(userData.token);

    // Set token expiry (24 hours from now)
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24);
    tokenService.setTokenExpiry(expiryTime);

    // Set user data
    tokenService.setUserRole(userData.role);
    tokenService.setUserUUID(userData.uuid);
    if (userData.username) {
      tokenService.setUserName(userData.username);
    }
  },

  // Clear all user data
  clearUserData: (): void => {
    tokenService.removeToken();
    tokenService.removeTokenExpiry();
    tokenService.removeUserRole();
    tokenService.removeUserUUID();
    tokenService.removeUserName();
  },
};
