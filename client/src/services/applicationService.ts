// Path: services\applicationService.ts
import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import {
  Application,
  ApplicationCreateRequest,
  ApplicationUpdateRequest,
} from '@/types/application';

/**
 * Get all applications
 */
export const getApplications = async (): Promise<
  ApiResponse<Application[]>
> => {
  try {
    const response =
      await apiClient.get<ApiResponse<Application[]>>('/api/aplicacoes');
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

/**
 * Create a new application
 */
export const createApplication = async (
  applicationData: ApplicationCreateRequest,
): Promise<ApiResponse<Application>> => {
  try {
    const response = await apiClient.post<ApiResponse<Application>>(
      '/api/aplicacoes',
      applicationData,
    );
    return response.data;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

/**
 * Update an existing application
 */
export const updateApplication = async (
  applicationData: ApplicationUpdateRequest,
): Promise<ApiResponse<Application>> => {
  try {
    const response = await apiClient.put<ApiResponse<Application>>(
      `/api/aplicacoes/${applicationData.id}`,
      applicationData,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};

/**
 * Delete an application
 */
export const deleteApplication = async (
  id: number,
): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/api/aplicacoes/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
};
