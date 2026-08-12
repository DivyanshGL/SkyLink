package com.skylink.booking.service;

import com.skylink.booking.client.UserServiceClient;
import com.skylink.booking.dto.request.CreateBookingRequest;
import com.skylink.booking.dto.response.ApiResponse;
import com.skylink.booking.dto.response.BookingResponse;
import com.skylink.booking.dto.response.UserProfileResponse;
import com.skylink.booking.entity.Booking;
import com.skylink.booking.entity.BookingStatus;
import com.skylink.booking.exception.BookingException;
import com.skylink.booking.exception.BookingNotFoundException;
import com.skylink.booking.feign.FlightClient;
import com.skylink.booking.feign.request.ReserveSeatRequest;
import com.skylink.booking.feign.response.FlightResponse;
import com.skylink.booking.kafka.event.BookingEvent;
import com.skylink.booking.kafka.event.PaymentEvent;
import com.skylink.booking.kafka.producer.BookingProducer;
import com.skylink.booking.repository.BookingRepository;
import com.skylink.booking.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private FlightClient flightClient;

    @Mock
    private BookingProducer bookingProducer;

    @Mock
    private UserServiceClient userServiceClient;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private Booking booking;
    private CreateBookingRequest createRequest;
    private FlightResponse flightResponse;
    private UserProfileResponse userProfileResponse;

    @BeforeEach
    void setUp() {
        booking = Booking.builder()
                .id(1L)
                .userId(2L)
                .flightId(3L)
                .seatsBooked(2)
                .totalFare(new BigDecimal("399.98"))
                .status(BookingStatus.PENDING_PAYMENT)
                .bookingTime(LocalDateTime.now())
                .build();

        createRequest = new CreateBookingRequest(2L, 3L, 2);

        flightResponse = FlightResponse.builder()
                .id(3L)
                .availableSeats(50)
                .price(new BigDecimal("199.99"))
                .build();

        userProfileResponse = UserProfileResponse.builder()
                .id(2L)
                .email("test@example.com")
                .build();
    }

    @Test
    void createBooking_Success() {
        when(flightClient.getFlightById(anyLong())).thenReturn(ApiResponse.<FlightResponse>builder().data(flightResponse).build());
        when(userServiceClient.getUserById(anyLong())).thenReturn(ApiResponse.<UserProfileResponse>builder().data(userProfileResponse).build());
        when(flightClient.reserveSeats(anyLong(), any(ReserveSeatRequest.class))).thenReturn(null);
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);
        doNothing().when(bookingProducer).publishBookingCreated(any(BookingEvent.class));

        ApiResponse<BookingResponse> response = bookingService.createBooking(createRequest);

        assertTrue(response.isSuccess());
        assertEquals(BookingStatus.PENDING_PAYMENT, response.getData().getStatus());
        assertEquals(2, response.getData().getSeatsBooked());
        verify(bookingRepository, times(1)).save(any(Booking.class));
        verify(bookingProducer, times(1)).publishBookingCreated(any(BookingEvent.class));
    }

    @Test
    void createBooking_UserNotFound() {
        when(flightClient.getFlightById(anyLong())).thenReturn(ApiResponse.<FlightResponse>builder().data(flightResponse).build());
        when(userServiceClient.getUserById(anyLong())).thenReturn(ApiResponse.<UserProfileResponse>builder().data(null).build());

        assertThrows(BookingException.class, () -> bookingService.createBooking(createRequest));
    }

    @Test
    void createBooking_FlightNotFound() {
        when(flightClient.getFlightById(anyLong())).thenReturn(ApiResponse.<FlightResponse>builder().data(null).build());
        when(userServiceClient.getUserById(anyLong())).thenReturn(ApiResponse.<UserProfileResponse>builder().data(userProfileResponse).build());

        assertThrows(BookingException.class, () -> bookingService.createBooking(createRequest));
    }

    @Test
    void createBooking_NotEnoughSeats() {
        flightResponse.setAvailableSeats(1);
        when(flightClient.getFlightById(anyLong())).thenReturn(ApiResponse.<FlightResponse>builder().data(flightResponse).build());
        when(userServiceClient.getUserById(anyLong())).thenReturn(ApiResponse.<UserProfileResponse>builder().data(userProfileResponse).build());

        assertThrows(BookingException.class, () -> bookingService.createBooking(createRequest));
    }

    @Test
    void getAllBookings_Success() {
        when(bookingRepository.findAll()).thenReturn(List.of(booking));

        ApiResponse<List<BookingResponse>> response = bookingService.getAllBookings();

        assertTrue(response.isSuccess());
        assertEquals(1, response.getData().size());
        assertEquals(3L, response.getData().get(0).getFlightId());
    }

    @Test
    void getBookingById_Success() {
        when(bookingRepository.findById(anyLong())).thenReturn(Optional.of(booking));

        ApiResponse<BookingResponse> response = bookingService.getBookingById(1L);

        assertTrue(response.isSuccess());
        assertEquals(3L, response.getData().getFlightId());
    }

    @Test
    void cancelBooking_Success() {
        when(bookingRepository.findById(anyLong())).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        ApiResponse<String> response = bookingService.cancelBooking(1L);

        assertTrue(response.isSuccess());
        assertEquals(BookingStatus.CANCELLED, booking.getStatus());
    }

    @Test
    void cancelBooking_AlreadyCancelled() {
        booking.setStatus(BookingStatus.CANCELLED);
        when(bookingRepository.findById(anyLong())).thenReturn(Optional.of(booking));

        assertThrows(BookingException.class, () -> bookingService.cancelBooking(1L));
    }

    @Test
    void confirmBooking_Success() {
        PaymentEvent event = new PaymentEvent();
        event.setBookingId(1L);
        when(bookingRepository.findById(anyLong())).thenReturn(Optional.of(booking));

        bookingService.confirmBooking(event);

        assertEquals(BookingStatus.CONFIRMED, booking.getStatus());
        verify(bookingRepository, times(1)).save(booking);
    }
}
