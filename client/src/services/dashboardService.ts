// Path: services\dashboardService.ts
import apiClient from '../lib/axios';
import { ApiResponse } from '../types/api';
import {
  DashboardData,
  LoggedInUser,
  DailyLoginStats,
  MonthlyLoginStats,
  ApplicationLoginStats,
  UserLoginStats,
} from '../types/dashboard';

/**
 * Get all dashboard data in a single request
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const [
      usuariosLogados,
      usuariosAtivos,
      aplicacoesAtivas,
      loginsPorDia,
      loginsPorMes,
      loginsPorAplicacao,
      loginsPorUsuario,
    ] = await Promise.all([
      getLoggedInUsers(),
      getActiveUsers(),
      getActiveApplications(),
      getDailyLoginStats(),
      getMonthlyLoginStats(),
      getApplicationLoginStats(),
      getUserLoginStats(),
    ]);

    return {
      usuariosLogados,
      usuariosAtivos,
      aplicacoesAtivas,
      loginsPorDia,
      loginsPorMes,
      loginsPorAplicacao,
      loginsPorUsuario,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * Get users currently logged in
 * @private Internal use only - called by getDashboardData
 */
const getLoggedInUsers = async (): Promise<LoggedInUser[]> => {
  try {
    const response = await apiClient.get<ApiResponse<LoggedInUser[]>>(
      '/api/dashboard/usuarios_logados',
    );
    return response.data.dados || [];
  } catch (error) {
    console.error('Error fetching logged in users:', error);
    throw error;
  }
};

/**
 * Get count of active users
 * @private Internal use only - called by getDashboardData
 */
const getActiveUsers = async (): Promise<number> => {
  try {
    const response = await apiClient.get<ApiResponse<number>>(
      '/api/dashboard/usuarios_ativos',
    );
    return response.data.dados || 0;
  } catch (error) {
    console.error('Error fetching active users:', error);
    throw error;
  }
};

/**
 * Get count of active applications
 * @private Internal use only - called by getDashboardData
 */
const getActiveApplications = async (): Promise<number> => {
  try {
    const response = await apiClient.get<ApiResponse<number>>(
      '/api/dashboard/aplicacoes_ativas',
    );
    return response.data.dados || 0;
  } catch (error) {
    console.error('Error fetching active applications:', error);
    throw error;
  }
};

/**
 * Get daily login statistics
 * @private Internal use only - called by getDashboardData
 */
const getDailyLoginStats = async (): Promise<DailyLoginStats[]> => {
  try {
    const response = await apiClient.get<ApiResponse<DailyLoginStats[]>>(
      '/api/dashboard/logins/dia?total=14',
    );
    return response.data.dados || [];
  } catch (error) {
    console.error('Error fetching daily login stats:', error);
    throw error;
  }
};

/**
 * Get monthly login statistics
 * @private Internal use only - called by getDashboardData
 */
const getMonthlyLoginStats = async (): Promise<MonthlyLoginStats[]> => {
  try {
    const response = await apiClient.get<ApiResponse<MonthlyLoginStats[]>>(
      '/api/dashboard/logins/mes?total=12',
    );
    return response.data.dados || [];
  } catch (error) {
    console.error('Error fetching monthly login stats:', error);
    throw error;
  }
};

/**
 * Get login statistics per application
 * @private Internal use only - called by getDashboardData
 */
const getApplicationLoginStats = async (): Promise<ApplicationLoginStats[]> => {
  try {
    const response = await apiClient.get<ApiResponse<ApplicationLoginStats[]>>(
      '/api/dashboard/logins/aplicacoes?max=14&total=10',
    );
    return response.data.dados || [];
  } catch (error) {
    console.error('Error fetching application login stats:', error);
    throw error;
  }
};

/**
 * Get login statistics per user
 * @private Internal use only - called by getDashboardData
 */
const getUserLoginStats = async (): Promise<UserLoginStats[]> => {
  try {
    const response = await apiClient.get<ApiResponse<UserLoginStats[]>>(
      '/api/dashboard/logins/usuarios?max=14&total=10',
    );
    return response.data.dados || [];
  } catch (error) {
    console.error('Error fetching user login stats:', error);
    throw error;
  }
};
