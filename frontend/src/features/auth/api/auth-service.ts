import { apiClient } from '../../../lib/api-client';
import { ApiResponse, AuthResponse } from '../../../types/api.types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return res.data.data;
  },

  register: async (email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    return res.data.data;
  },

  getCurrentUser: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  },
};
