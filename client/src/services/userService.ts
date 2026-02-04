// Path: services\userService.ts
import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import {
  User,
  UserPosition,
  UserShift,
  UserCreateRequest,
  UserUpdateRequest,
} from '@/types/user';

// Export the userServicePrivate
export { userServicePrivate } from './userServicePrivate';

// Get user positions (posto/graduação)
export const getUserPositions = async (): Promise<
  ApiResponse<UserPosition[]>
> => {
  try {
    const response = await apiClient.get<ApiResponse<UserPosition[]>>(
      '/api/usuarios/tipo_posto_grad',
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user positions:', error);
    throw error;
  }
};

// Get user shifts (turnos)
export const getUserShifts = async (): Promise<ApiResponse<UserShift[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<UserShift[]>>(
      '/api/usuarios/tipo_turno',
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user shifts:', error);
    throw error;
  }
};

// Get all users
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<User[]>>(
      '/api/usuarios/completo',
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Create a new user
export const createUser = async (
  data: UserCreateRequest,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      '/api/usuarios/completo',
      {
        usuario: data.usuario,
        nome: data.nome,
        senha: data.usuario, // Default password is the username
        nome_guerra: data.nomeGuerra,
        tipo_posto_grad_id: data.tipoPostoGradId,
        tipo_turno_id: data.tipoTurnoId,
        ativo: data.ativo,
        administrador: data.administrador,
        ...(data.uuid && { uuid: data.uuid }),
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Register a new user (public endpoint)
export const signUp = async (data: {
  usuario: string;
  senha: string;
  nome: string;
  nomeGuerra: string;
  tipoPostoGradId: number;
  tipoTurnoId: number;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      '/api/usuarios/',
      {
        usuario: data.usuario,
        senha: data.senha,
        nome: data.nome,
        nome_guerra: data.nomeGuerra,
        tipo_posto_grad_id: data.tipoPostoGradId,
        tipo_turno_id: data.tipoTurnoId,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error;
  }
};

// Update an existing user
export const updateUser = async (
  uuid: string,
  data: UserUpdateRequest,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.put<ApiResponse<any>>(
      `/api/usuarios/completo/${uuid}`,
      {
        uuid: data.novoUuid || data.uuid,
        usuario: data.usuario,
        nome: data.nome,
        nome_guerra: data.nomeGuerra,
        tipo_posto_grad_id: data.tipoPostoGradId,
        tipo_turno_id: data.tipoTurnoId,
        administrador: data.administrador,
        ativo: data.ativo,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (uuid: string): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.delete<ApiResponse<any>>(
      `/api/usuarios/${uuid}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Authorize users
export const authorizeUsers = async (
  userUuids: string[],
  authorize: boolean,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/usuarios/autorizacao/${authorize ? 'true' : 'false'}`,
      { usuarios_uuids: userUuids },
    );
    return response.data;
  } catch (error) {
    console.error('Error authorizing users:', error);
    throw error;
  }
};

// Reset passwords for users
export const resetPasswords = async (
  userUuids: string[],
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      '/api/usuarios/senha/resetar',
      { usuarios_uuids: userUuids },
    );
    return response.data;
  } catch (error) {
    console.error('Error resetting passwords:', error);
    throw error;
  }
};
