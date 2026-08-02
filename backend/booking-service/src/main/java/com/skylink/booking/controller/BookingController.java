package com.skylink.booking.controller;

import com.skylink.booking.dto.request.CreateBookingRequest;
import com.skylink.booking.dto.response.ApiResponse;
import com.skylink.booking.dto.response.BookingResponse;
import com.skylink.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ApiResponse<BookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request){

        return bookingService.createBooking(request);
    }

    @GetMapping("/{id}")
    public ApiResponse<BookingResponse> getBookingById(
            @PathVariable Long id) {

        return bookingService.getBookingById(id);
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<BookingResponse>> getBookingsByUser(
            @PathVariable Long userId) {

        return bookingService.getBookingsByUser(userId);
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<String> cancelBooking(
            @PathVariable Long id){

        return bookingService.cancelBooking(id);
    }

}