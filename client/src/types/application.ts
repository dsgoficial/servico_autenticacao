// Path: types\application.ts
/**
 * Application entity
 * Represents an application that uses the authentication service
 */
export interface Application {
  id: number;
  nome: string;
  nome_abrev: string;
  ativa: boolean;
}

/**
 * Application create request
 */
export interface ApplicationCreateRequest {
  nome: string;
  nome_abrev: string;
  ativa: boolean;
}

/**
 * Application update request
 */
export interface ApplicationUpdateRequest extends ApplicationCreateRequest {
  id: number;
}
