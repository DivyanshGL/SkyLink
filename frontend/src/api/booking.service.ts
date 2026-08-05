import { axiosInstance } from './axiosInstance';
import { ApiResponse, Booking, CreateBookingRequest } from '../types';

export const bookingService = {
  createBooking: async (data: CreateBookingRequest): Promise<ApiResponse<Booking>> => {
    const response = await axiosInstance.post('/bookings', data);
    return response.data;
  },
  getBookingById: async (id: number): Promise<ApiResponse<Booking>> => {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  },
  getBookingsByUser: async (userId: number): Promise<ApiResponse<Booking[]>> => {
    const response = await axiosInstance.get(`/bookings/user/${userId}`);
    return response.data;
  },
  getAllBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await axiosInstance.get('/bookings');
    return response.data;
  },
  cancelBooking: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.patch(`/bookings/${id}/cancel`);
    return response.data;
  }
};
