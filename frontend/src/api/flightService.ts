import axiosClient from './axiosClient';

export const flightService = {
  getAllFlights: async () => {
    const response = await axiosClient.get('/flights');
    return response.data;
  },
  searchFlights: async (searchCriteria) => {
    const response = await axiosClient.post('/flights/search', searchCriteria);
    return response.data;
  },
  getFlightById: async (id) => {
    const response = await axiosClient.get(`/flights/${id}`);
    return response.data;
  },
  reserveSeats: async (id, seats) => {
    const response = await axiosClient.post(`/flights/${id}/reserve`, { seats });
    return response.data;
  }
};
