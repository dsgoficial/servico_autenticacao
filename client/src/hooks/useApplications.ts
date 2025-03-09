import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import {
  ApplicationCreateRequest,
  ApplicationUpdateRequest,
} from '@/types/application';
import { standardizeError } from '@/lib/queryClient';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '@/services/applicationService';

// Query keys
const APPLICATIONS_KEY = ['applications'];

/**
 * Custom hook for applications management
 * Refactored to match the direct data fetching pattern in useUsers
 */
export const useApplications = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  // Get all applications - direct API call like in useUsers
  const applicationsQuery = useQuery({
    queryKey: APPLICATIONS_KEY,
    queryFn: async () => {
      const response = await getApplications();
      return response.dados;
    },
  });

  // Create application mutation
  const createApplicationMutation = useMutation({
    mutationFn: (applicationData: ApplicationCreateRequest) => createApplication(applicationData),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
      enqueueSnackbar(data.message || 'Aplicação criada com sucesso', { variant: 'success' });
    },
    onError: error => {
      const standardizedError = standardizeError(error);
      enqueueSnackbar(standardizedError.message || 'Erro ao criar aplicação', {
        variant: 'error',
      });
    },
  });

  // Update application mutation
  const updateApplicationMutation = useMutation({
    mutationFn: (applicationData: ApplicationUpdateRequest) => updateApplication(applicationData),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
      enqueueSnackbar(data.message || 'Aplicação atualizada com sucesso', {
        variant: 'success',
      });
    },
    onError: error => {
      const standardizedError = standardizeError(error);
      enqueueSnackbar(
        standardizedError.message || 'Erro ao atualizar aplicação',
        {
          variant: 'error',
        },
      );
    },
  });

  // Delete application mutation
  const deleteApplicationMutation = useMutation({
    mutationFn: (id: number) => deleteApplication(id),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
      enqueueSnackbar(data.message || 'Aplicação removida com sucesso', {
        variant: 'success',
      });
    },
    onError: error => {
      const standardizedError = standardizeError(error);
      enqueueSnackbar(
        standardizedError.message || 'Erro ao remover aplicação',
        {
          variant: 'error',
        },
      );
    },
  });

  return {
    // Query results - match the pattern from useUsers
    applications: applicationsQuery.data || [],
    isLoading: applicationsQuery.isLoading,
    isError: applicationsQuery.isError,
    error: applicationsQuery.error ? standardizeError(applicationsQuery.error).message : null,

    // Mutations (using mutations directly like in useUsers)
    createApplication: createApplicationMutation.mutate,
    updateApplication: updateApplicationMutation.mutate,
    deleteApplication: deleteApplicationMutation.mutate,

    // Mutation states
    isCreating: createApplicationMutation.isPending,
    isUpdating: updateApplicationMutation.isPending,
    isDeleting: deleteApplicationMutation.isPending,

    // Refetch function
    refetch: applicationsQuery.refetch,
  };
};