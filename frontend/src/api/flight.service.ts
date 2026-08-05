import { axiosInstance } from './axiosInstance';
import { ApiResponse, Flight, CreateFlightRequest, SearchFlightRequest } from '../types';

export const flightService = {
  getAllFlights: async (): Promise<ApiResponse<Flight[]>> => {
    const response = await axiosInstance.get('/flights');
    return response.data;
  },
  getFlightById: async (id: number): Promise<ApiResponse<Flight>> => {
    const response = await axiosInstance.get(`/flights/${id}`);
    return response.data;
  },
  searchFlights: async (data: SearchFlightRequest): Promise<ApiResponse<Flight[]>> => {
    const response = await axiosInstance.post('/flights/search', data);
    return response.data;
  },
  addFlight: async (data: CreateFlightRequest): Promise<ApiResponse<Flight>> => {
    const response = await axiosInstance.post('/flights', data);
    return response.data;
  },
  updateFlight: async (id: number, data: CreateFlightRequest): Promise<ApiResponse<Flight>> => {
    const response = await axiosInstance.put(`/flights/${id}`, data);
    return response.data;
  },
  deleteFlight: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete(`/flights/${id}`);
    return response.data;
  },
  reserveSeats: async (id: number, seats: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post(`/flights/${id}/reserve`, { seats });
    return response.data;
  },
  releaseSeats: async (id: number, seats: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post(`/flights/${id}/release`, { seats });
    return response.data;
  }
};
