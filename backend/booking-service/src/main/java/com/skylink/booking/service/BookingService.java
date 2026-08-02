package com.skylink.booking.service;

import com.skylink.booking.dto.request.CreateBookingRequest;
import com.skylink.booking.dto.response.ApiResponse;
import com.skylink.booking.dto.response.BookingResponse;
import com.skylink.booking.kafka.event.PaymentEvent;

import java.util.List;

public interface BookingService {

    ApiResponse<BookingResponse> createBooking(CreateBookingRequest request);

    ApiResponse<List<BookingResponse>> getBookingsByUser(Long userId);

    ApiResponse<BookingResponse> getBookingById(Long bookingId);

    ApiResponse<String> cancelBooking(Long bookingId);

    void confirmBooking(PaymentEvent event);

    void failBooking(PaymentEvent event);

}