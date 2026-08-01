package com.skylink.flight.service.impl;

import com.skylink.flight.dto.request.CreateFlightRequest;
import com.skylink.flight.dto.request.SearchFlightRequest;
import com.skylink.flight.dto.response.ApiResponse;
import com.skylink.flight.dto.response.FlightResponse;
import com.skylink.flight.entity.Flight;
import com.skylink.flight.entity.FlightStatus;
import com.skylink.flight.exception.FlightAlreadyExistsException;
import com.skylink.flight.exception.FlightNotFoundException;
import com.skylink.flight.repository.FlightRepository;
import com.skylink.flight.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;

    @Override
    public ApiResponse<FlightResponse> addFlight(CreateFlightRequest request) {

        if (flightRepository.existsByFlightNumber(request.getFlightNumber())) {
            throw new FlightAlreadyExistsException("Flight already exists");
        }

        Flight flight = Flight.builder()
                .flightNumber(request.getFlightNumber())
                .airline(request.getAirline())
                .source(request.getSource())
                .destination(request.getDestination())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .price(request.getPrice())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getTotalSeats())
                .status(FlightStatus.SCHEDULED)
                .build();

        Flight savedFlight = flightRepository.save(flight);

        FlightResponse response = mapToResponse(savedFlight);

        return ApiResponse.<FlightResponse>builder()
                .success(true)
                .message("Flight created successfully")
                .data(response)
                .build();
    }

    @Override
    public ApiResponse<List<FlightResponse>> getAllFlights() {

        List<FlightResponse> flights = flightRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ApiResponse.<List<FlightResponse>>builder()
                .success(true)
                .message("Flights fetched successfully")
                .data(flights)
                .build();
    }

    @Override
    public ApiResponse<FlightResponse> getFlightById(Long id) {

        Flight flight = flightRepository.findById(id)
                .orElseThrow(() ->
                        new FlightNotFoundException("Flight not found with id: " + id));

        return ApiResponse.<FlightResponse>builder()
                .success(true)
                .message("Flight fetched successfully")
                .data(mapToResponse(flight))
                .build();
    }

    @Override
    public ApiResponse<List<FlightResponse>> searchFlights(SearchFlightRequest request) {

        LocalDateTime start = request.getTravelDate().atStartOfDay();
        LocalDateTime end = request.getTravelDate().atTime(23, 59, 59);

        List<FlightResponse> flights = flightRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDepartureTimeBetweenAndStatus(
                        request.getSource(),
                        request.getDestination(),
                        start,
                        end,
                        FlightStatus.SCHEDULED
                )
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ApiResponse.<List<FlightResponse>>builder()
                .success(true)
                .message("Flights fetched successfully")
                .data(flights)
                .build();
    }

    @Override
    public ApiResponse<FlightResponse> updateFlight(Long id, CreateFlightRequest request) {

        Flight flight = flightRepository.findById(id)
                .orElseThrow(() ->
                        new FlightNotFoundException("Flight not found with id: " + id));

        flight.setFlightNumber(request.getFlightNumber());
        flight.setAirline(request.getAirline());
        flight.setSource(request.getSource());
        flight.setDestination(request.getDestination());
        flight.setDepartureTime(request.getDepartureTime());
        flight.setArrivalTime(request.getArrivalTime());
        flight.setPrice(request.getPrice());

        if (!flight.getTotalSeats().equals(request.getTotalSeats())) {

            int bookedSeats = flight.getTotalSeats() - flight.getAvailableSeats();

            flight.setTotalSeats(request.getTotalSeats());
            flight.setAvailableSeats(request.getTotalSeats() - bookedSeats);
        }

        Flight updatedFlight = flightRepository.save(flight);

        return ApiResponse.<FlightResponse>builder()
                .success(true)
                .message("Flight updated successfully")
                .data(mapToResponse(updatedFlight))
                .build();
    }

    @Override
    public ApiResponse<String> deleteFlight(Long id) {

        Flight flight = flightRepository.findById(id)
                .orElseThrow(() ->
                        new FlightNotFoundException("Flight not found with id: " + id));

        flightRepository.delete(flight);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Flight deleted successfully")
                .data("Deleted")
                .build();
    }

    private FlightResponse mapToResponse(Flight flight) {

        return FlightResponse.builder()
                .id(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .airline(flight.getAirline())
                .source(flight.getSource())
                .destination(flight.getDestination())
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .price(flight.getPrice())
                .totalSeats(flight.getTotalSeats())
                .availableSeats(flight.getAvailableSeats())
                .status(flight.getStatus())
                .build();
    }
}