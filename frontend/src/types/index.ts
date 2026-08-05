export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  active?: boolean;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: string;
}

export interface Flight {
  id: number;
  flightNumber: string;
  airline: string;
  source: string;
  destination: string;
  departureTime: string; // ISO String
  arrivalTime: string; // ISO String
  price: number;
  totalSeats: number;
  availableSeats: number;
  status: 'SCHEDULED' | 'DELAYED' | 'CANCELLED';
}

export interface CreateFlightRequest {
  flightNumber: string;
  airline: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
}

export interface SearchFlightRequest {
  source: string;
  destination: string;
  travelDate: string; // YYYY-MM-DD
}

export interface Booking {
  id: number;
  userId: number;
  flightId: number;
  seatsBooked: number;
  totalFare: number;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'PAYMENT_FAILED';
  bookingTime: string;
}

export interface CreateBookingRequest {
  userId: number;
  flightId: number;
  seatsBooked: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
