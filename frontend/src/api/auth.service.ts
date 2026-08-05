import { axiosInstance } from './axiosInstance';
import { ApiResponse, LoginResponse } from '../types';

export const authService = {
  login: async (data: any): Promise<ApiResponse<LoginResponse>> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },
  register: async (data: any): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },
  getMe: async (): Promise<string> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }
};
