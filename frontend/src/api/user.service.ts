import { axiosInstance } from './axiosInstance';
import { ApiResponse, User } from '../types';

export const userService = {
  getProfile: async (id: number): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },
  updateProfile: async (id: number, data: any): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },
  deactivateUser: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.patch(`/users/${id}/deactivate`);
    return response.data;
  }
};
