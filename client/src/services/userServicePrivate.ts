// Path: services\userServicePrivate.ts
import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import {
  User,
  UserInfoUpdateRequest,
  UserPasswordUpdateRequest,
} from '@/types/user';

// Export the private user service methods directly
export const userServicePrivate = {
  // Get current user information
  getCurrentUser: async (uuid: string): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        `/api/usuarios/${uuid}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Update user information
  updateUserInfo: async (
    uuid: string,
    data: UserInfoUpdateRequest,
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.put<ApiResponse<any>>(
        `/api/usuarios/${uuid}`,
        {
          nome: data.nome,
          nome_guerra: data.nomeGuerra,
          tipo_posto_grad_id: data.tipoPostoGradId,
          tipo_turno_id: data.tipoTurnoId,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user info:', error);
      throw error;
    }
  },

  // Update user password
  updatePassword: async (
    uuid: string,
    data: UserPasswordUpdateRequest,
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.put<ApiResponse<any>>(
        `/api/usuarios/${uuid}/senha`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },
};
