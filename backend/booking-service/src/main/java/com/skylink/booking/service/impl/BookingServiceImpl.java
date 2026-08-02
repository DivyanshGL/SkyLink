package com.skylink.booking.service.impl;

import com.skylink.booking.dto.request.CreateBookingRequest;
import com.skylink.booking.dto.response.ApiResponse;
import com.skylink.booking.dto.response.BookingResponse;
import com.skylink.booking.entity.Booking;
import com.skylink.booking.exception.BookingException;
import com.skylink.booking.exception.BookingNotFoundException;
import com.skylink.booking.feign.FlightClient;
import com.skylink.booking.feign.request.ReleaseSeatRequest;
import com.skylink.booking.feign.request.ReserveSeatRequest;
import com.skylink.booking.feign.response.FlightResponse;
import com.skylink.booking.kafka.event.BookingEvent;
import com.skylink.booking.kafka.event.PaymentEvent;
import com.skylink.booking.kafka.producer.BookingProducer;
import com.skylink.booking.repository.BookingRepository;
import com.skylink.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.skylink.booking.entity.BookingStatus;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final FlightClient flightClient;
    private final BookingProducer bookingProducer;

    @Override
    public ApiResponse<BookingResponse> createBooking(CreateBookingRequest request) {

        ApiResponse<FlightResponse> flightResponse =
                flightClient.getFlightById(request.getFlightId());

        FlightResponse flight = flightResponse.getData();

        if (flight == null) {
            throw new BookingException("Flight not found");
        }

        if (flight.getAvailableSeats() < request.getSeatsBooked()) {
            throw new BookingException("Not enough seats available");
        }

        flightClient.reserveSeats(
                request.getFlightId(),
                ReserveSeatRequest.builder()
                        .seats(request.getSeatsBooked())
                        .build()
        );

        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .flightId(request.getFlightId())
                .seatsBooked(request.getSeatsBooked())
                .totalFare(
                        flight.getPrice()
                                .multiply(
                                        java.math.BigDecimal.valueOf(
                                                request.getSeatsBooked()
                                        )
                                )
                )
                .status(BookingStatus.PENDING_PAYMENT)
                .bookingTime(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        System.out.println("Booking saved with status: " + booking.getStatus());
        BookingEvent event = BookingEvent.builder()
                .bookingId(savedBooking.getId())
                .userId(savedBooking.getUserId())
                .flightId(savedBooking.getFlightId())
                .seatsBooked(savedBooking.getSeatsBooked())
                .totalFare(savedBooking.getTotalFare())
                .status(savedBooking.getStatus().name())
                .build();

        bookingProducer.publishBookingCreated(event);

        BookingResponse response = mapToResponse(savedBooking);

        return ApiResponse.<BookingResponse>builder()
                .success(true)
                .message("Booking created successfully")
                .data(response)
                .build();
    }

    @Override
    public ApiResponse<List<BookingResponse>> getBookingsByUser(Long userId) {

        List<BookingResponse> bookings = bookingRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .message("Bookings fetched successfully")
                .data(bookings)
                .build();
    }

    @Override
    public ApiResponse<BookingResponse> getBookingById(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new BookingNotFoundException("Booking not found with id: " + bookingId));

        return ApiResponse.<BookingResponse>builder()
                .success(true)
                .message("Booking fetched successfully")
                .data(mapToResponse(booking))
                .build();
    }

    @Override
    public ApiResponse<String> cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new BookingNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingException("Booking is already cancelled");
        }

        flightClient.releaseSeats(
                booking.getFlightId(),
                ReleaseSeatRequest.builder()
                        .seats(booking.getSeatsBooked())
                        .build()
        );

        booking.setStatus(BookingStatus.CANCELLED);

        bookingRepository.save(booking);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Booking cancelled successfully")
                .data("Booking Cancelled")
                .build();
    }

    @Override
    public void confirmBooking(PaymentEvent event) {

        Booking booking = bookingRepository.findById(event.getBookingId())
                .orElseThrow(() ->
                        new BookingNotFoundException(
                                "Booking not found with id: " + event.getBookingId()
                        ));

        booking.setStatus(BookingStatus.CONFIRMED);

        bookingRepository.save(booking);

        System.out.println("========== BOOKING CONFIRMED ==========");
        System.out.println(event);
    }

    @Override
    public void failBooking(PaymentEvent event) {

        Booking booking = bookingRepository.findById(event.getBookingId())
                .orElseThrow(() ->
                        new BookingNotFoundException(
                                "Booking not found with id: " + event.getBookingId()
                        ));

        booking.setStatus(BookingStatus.PAYMENT_FAILED);

        bookingRepository.save(booking);

        System.out.println("========== PAYMENT FAILED ==========");
        System.out.println(event);
    }

    private BookingResponse mapToResponse(Booking booking){

        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .flightId(booking.getFlightId())
                .seatsBooked(booking.getSeatsBooked())
                .totalFare(booking.getTotalFare())
                .status(booking.getStatus())
                .bookingTime(booking.getBookingTime())
                .build();
    }
}