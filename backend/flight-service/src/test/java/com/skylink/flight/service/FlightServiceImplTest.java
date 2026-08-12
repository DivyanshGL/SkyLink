package com.skylink.flight.service;

import com.skylink.flight.dto.request.CreateFlightRequest;
import com.skylink.flight.dto.request.SearchFlightRequest;
import com.skylink.flight.dto.response.ApiResponse;
import com.skylink.flight.dto.response.FlightResponse;
import com.skylink.flight.entity.Flight;
import com.skylink.flight.entity.FlightStatus;
import com.skylink.flight.exception.FlightAlreadyExistsException;
import com.skylink.flight.exception.FlightNotFoundException;
import com.skylink.flight.exception.InsufficientSeatsException;
import com.skylink.flight.repository.FlightRepository;
import com.skylink.flight.service.impl.FlightServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FlightServiceImplTest {

    @Mock
    private FlightRepository flightRepository;

    @InjectMocks
    private FlightServiceImpl flightService;

    private Flight flight;
    private CreateFlightRequest createFlightRequest;

    @BeforeEach
    void setUp() {
        flight = Flight.builder()
                .id(1L)
                .flightNumber("SK101")
                .airline("SkyLink Air")
                .source("NYC")
                .destination("LAX")
                .departureTime(LocalDateTime.now().plusDays(1))
                .arrivalTime(LocalDateTime.now().plusDays(1).plusHours(5))
                .price(new BigDecimal("199.99"))
                .totalSeats(150)
                .availableSeats(150)
                .status(FlightStatus.SCHEDULED)
                .build();

        createFlightRequest = new CreateFlightRequest(
                "SK101",
                "SkyLink Air",
                "NYC",
                "LAX",
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(5),
                new BigDecimal("199.99"),
                150
        );
    }

    @Test
    void addFlight_Success() {
        when(flightRepository.existsByFlightNumber(anyString())).thenReturn(false);
        when(flightRepository.save(any(Flight.class))).thenAnswer(i -> i.getArguments()[0]);

        ApiResponse<FlightResponse> response = flightService.addFlight(createFlightRequest);

        assertTrue(response.isSuccess());
        assertEquals("SK101", response.getData().getFlightNumber());
        assertEquals(150, response.getData().getAvailableSeats());
    }

    @Test
    void addFlight_FlightAlreadyExists() {
        when(flightRepository.existsByFlightNumber(anyString())).thenReturn(true);

        assertThrows(FlightAlreadyExistsException.class, () -> flightService.addFlight(createFlightRequest));
    }

    @Test
    void getFlightById_Success() {
        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));

        ApiResponse<FlightResponse> response = flightService.getFlightById(1L);

        assertTrue(response.isSuccess());
        assertEquals("SK101", response.getData().getFlightNumber());
    }

    @Test
    void getFlightById_NotFound() {
        when(flightRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(FlightNotFoundException.class, () -> flightService.getFlightById(1L));
    }

    @Test
    void searchFlights_Success() {
        SearchFlightRequest searchReq = new SearchFlightRequest("NYC", "LAX", LocalDate.now().plusDays(1));
        
        when(flightRepository.findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDepartureTimeBetweenAndStatus(
                eq("NYC"), eq("LAX"), any(LocalDateTime.class), any(LocalDateTime.class), eq(FlightStatus.SCHEDULED)
        )).thenReturn(List.of(flight));

        ApiResponse<List<FlightResponse>> response = flightService.searchFlights(searchReq);

        assertTrue(response.isSuccess());
        assertEquals(1, response.getData().size());
        assertEquals("SK101", response.getData().get(0).getFlightNumber());
    }

    @Test
    void reserveSeats_Success() {
        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));
        when(flightRepository.save(any(Flight.class))).thenReturn(flight);

        ApiResponse<String> response = flightService.reserveSeats(1L, 2);

        assertTrue(response.isSuccess());
        assertEquals(148, flight.getAvailableSeats()); // 150 - 2
    }

    @Test
    void reserveSeats_InsufficientSeats() {
        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));

        assertThrows(InsufficientSeatsException.class, () -> flightService.reserveSeats(1L, 151));
    }

    @Test
    void releaseSeats_Success() {
        flight.setAvailableSeats(148);
        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));
        when(flightRepository.save(any(Flight.class))).thenReturn(flight);

        ApiResponse<String> response = flightService.releaseSeats(1L, 2);

        assertTrue(response.isSuccess());
        assertEquals(150, flight.getAvailableSeats()); // 148 + 2
    }
}
