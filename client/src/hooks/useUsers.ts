import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import {
  getUsers,
  getUserPositions,
  getUserShifts,
  createUser,
  updateUser,
  deleteUser,
  authorizeUsers,
  resetPasswords,
  userServicePrivate,
} from '@/services/userService';
import {
  UserCreateRequest,
  UserUpdateRequest,
  UserInfoUpdateRequest,
  UserPasswordChange,
} from '@/types/user';
import { standardizeError } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';
import { ApiResponse } from '@/types/api';

// Query keys
const USERS_KEY = ['users'];
const USER_POSITIONS_KEY = ['userPositions'];
const USER_SHIFTS_KEY = ['userShifts'];
const USER_PROFILE_KEY = ['userProfile'];

// Hook for user-related operations
export const useUsers = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Get all users
  const usersQuery = useQuery({
    queryKey: USERS_KEY,
    queryFn: async () => {
      const response = await getUsers();
      return response.dados;
    },
  });

  // Get user positions
  const positionsQuery = useQuery({
    queryKey: USER_POSITIONS_KEY,
    queryFn: async () => {
      const response = await getUserPositions();
      return response.dados;
    },
  });

  // Get user shifts
  const shiftsQuery = useQuery({
    queryKey: USER_SHIFTS_KEY,
    queryFn: async () => {
      const response = await getUserShifts();
      return response.dados;
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: UserCreateRequest) => createUser(userData),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      enqueueSnackbar(data.message || 'Usuário criado com sucesso', {
        variant: 'success',
      });
    },
    onError: error => {
      const standardizedError = standardizeError(error);
      enqueueSnackbar(standardizedError.message || 'Erro ao criar usuário', {
        variant: 'error',
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({
      uuid,
      userData,
    }: {
      uuid: string;
      userData: UserUpdateRequest;
    }) => updateUser(uuid, userData),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      enqueueSnackbar(data.message || 'Usuário atualizado com sucesso', {
        variant: 'success',
      });
    },
    onError: error => {
      const standardizedError = standardizeError(error);
      enqueueSnackbar(
        standardizedError.message || 'Erro ao atualizar usuário',
        { variant: 'error' },
      );
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (uuid: string) => deleteUser(uuid),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      enqueueSnackbar(data.message || 'Usuário removido com sucesso', {
        variant: 'success',
      });
    },
    onError: error => {
      const standardizedError = standardizeError(error);
      enqueueSnackbar(standardizedError.message || 'Erro ao remover usuário', {
        variant: 'error',
      });
    },
  });

  // Authorize users mutation
  const authorizeUsersMutation = useMutation({
    mutationFn: ({
      userUuids,
      authorize,
    }: {
      userUuids: string[];
      authorize: boolean;
    }) => authorizeUsers(userUuids, authorize),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      enqueueSnackbar(
        data.message ||
          `Usuários ${authorizeUsersMutation.variables?.authorize ? 'autorizados' : 'desautorizados'} com sucesso`,
        { variant: 'success' },
      );
    },
    onError: error => {
      const standardizedError = standardizeError(error);
      enqueueSnackbar(
        standardizedError.message || 'Erro ao autorizar usuários',
        { variant: 'error' },
      );
    },
  });

  // Reset passwords mutation
  const resetPasswordsMutation = useMutation({
    mutationFn: (userUuids: string[]) => resetPasswords(userUuids),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      enqueueSnackbar(data.message || 'Senhas resetadas com sucesso', {
        variant: 'success',
      });
    },
    onError: error => {
      const standardizedError = standardizeError(error);
      enqueueSnackbar(standardizedError.message || 'Erro ao resetar senhas', {
        variant: 'error',
      });
    },
  });

  return {
    // Queries
    users: usersQuery.data || [],
    positions: positionsQuery.data || [],
    shifts: shiftsQuery.data || [],
    isLoading:
      usersQuery.isLoading || positionsQuery.isLoading || shiftsQuery.isLoading,
    isError:
      usersQuery.isError || positionsQuery.isError || shiftsQuery.isError,

    // Mutations
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    authorizeUsers: authorizeUsersMutation.mutate,
    resetPasswords: resetPasswordsMutation.mutate,

    // Mutation states
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isAuthorizing: authorizeUsersMutation.isPending,
    isResettingPasswords: resetPasswordsMutation.isPending,
    
    // Refetch function
    refetch: usersQuery.refetch,
  };
};

// Hook for user profile operations
export const useUserProfile = () => {
  const { getUUID } = useAuthStore();
  const uuid = getUUID();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Get user profile
  const profileQuery = useQuery({
    queryKey: [USER_PROFILE_KEY, uuid],
    queryFn: async () => {
      if (!uuid) throw new Error('User UUID not found');
      const response = await userServicePrivate.getCurrentUser(uuid);
      return response.dados;
    },
    enabled: !!uuid,
  });

  // Get user positions
  const positionsQuery = useQuery({
    queryKey: USER_POSITIONS_KEY,
    queryFn: async () => {
      const response = await getUserPositions();
      return response.dados;
    },
  });

  // Get user shifts
  const shiftsQuery = useQuery({
    queryKey: USER_SHIFTS_KEY,
    queryFn: async () => {
      const response = await getUserShifts();
      return response.dados;
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UserInfoUpdateRequest) => {
      if (!uuid) throw new Error('User UUID not found');
      return userServicePrivate.updateUserInfo(uuid, data);
    },
    onSuccess: (data: ApiResponse<any>) => {
      // Invalidate both the profile query and the users list query
      queryClient.invalidateQueries({ queryKey: [USER_PROFILE_KEY, uuid] });
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      
      enqueueSnackbar(data.message || 'Perfil atualizado com sucesso', {
        variant: 'success',
      });
    },
    onError: error => {
      const standardizedError = standardizeError(error);
      enqueueSnackbar(standardizedError.message || 'Erro ao atualizar perfil', {
        variant: 'error',
      });
    },
  });

  return {
    userInfo: profileQuery.data,
    positions: positionsQuery.data || [],
    shifts: shiftsQuery.data || [],
    isLoading:
      profileQuery.isLoading ||
      positionsQuery.isLoading ||
      shiftsQuery.isLoading,
    isError:
      profileQuery.isError || positionsQuery.isError || shiftsQuery.isError,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
};

// Hook for user password operations
export const useUserPassword = () => {
  const { getUUID } = useAuthStore();
  const uuid = getUUID();
  const { enqueueSnackbar } = useSnackbar();

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data: UserPasswordChange) => {
      if (!uuid) throw new Error('User UUID not found');
      return userServicePrivate.updatePassword(uuid, {
        senha_atual: data.senhaAtual,
        senha_nova: data.novaSenha,
      });
    },
    onSuccess: (data: ApiResponse<any>) => {
      enqueueSnackbar(data.message || 'Senha atualizada com sucesso', {
        variant: 'success',
      });
    },
    onError: error => {
      const standardizedError = standardizeError(error);
      enqueueSnackbar(standardizedError.message || 'Erro ao atualizar senha', {
        variant: 'error',
      });
    },
  });

  return {
    updatePassword: updatePasswordMutation.mutate,
    isUpdating: updatePasswordMutation.isPending,
  };
};