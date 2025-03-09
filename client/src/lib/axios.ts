// Path: lib\axios.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '../types/api';
import { logoutAndRedirect } from '../stores/authStore';
import { tokenService } from '../services/tokenService';

// Access environment variables with correct Vite syntax
const apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3010';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = tokenService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status,
    };

    // Handle 401 and 403 errors (unauthorized/forbidden)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Use the centralized logout and redirect function
      logoutAndRedirect();
    }

    return Promise.reject(apiError);
  },
);

export default apiClient;
