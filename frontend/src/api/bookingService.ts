import axiosClient from './axiosClient';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await axiosClient.post('/bookings', bookingData);
    return response.data;
  },
  getBookingsByUser: async (userId) => {
    const response = await axiosClient.get(`/bookings/user/${userId}`);
    return response.data;
  },
  getBookingById: async (id) => {
    const response = await axiosClient.get(`/bookings/${id}`);
    return response.data;
  },
  cancelBooking: async (id) => {
    const response = await axiosClient.patch(`/bookings/${id}/cancel`);
    return response.data;
  }
};
