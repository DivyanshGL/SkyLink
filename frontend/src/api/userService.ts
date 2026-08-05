import axiosClient from './axiosClient';

export const userService = {
  createProfile: async (userData) => {
    const response = await axiosClient.post('/users', userData);
    return response.data;
  },
  getProfile: async (id) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },
  updateProfile: async (id, userData) => {
    const response = await axiosClient.put(`/users/${id}`, userData);
    return response.data;
  }
};
