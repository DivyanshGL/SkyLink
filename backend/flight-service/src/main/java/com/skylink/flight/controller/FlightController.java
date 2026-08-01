package com.skylink.flight.controller;

import com.skylink.flight.dto.request.CreateFlightRequest;
import com.skylink.flight.dto.request.SearchFlightRequest;
import com.skylink.flight.dto.response.ApiResponse;
import com.skylink.flight.dto.response.FlightResponse;
import com.skylink.flight.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @PostMapping
    public ApiResponse<FlightResponse> addFlight(
            @Valid @RequestBody CreateFlightRequest request) {

        return flightService.addFlight(request);
    }

    @GetMapping
    public ApiResponse<List<FlightResponse>> getAllFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/{id}")
    public ApiResponse<FlightResponse> getFlightById(@PathVariable Long id) {
        return flightService.getFlightById(id);
    }

    @PostMapping("/search")
    public ApiResponse<List<FlightResponse>> searchFlights(
            @Valid @RequestBody SearchFlightRequest request) {

        return flightService.searchFlights(request);
    }

    @PutMapping("/{id}")
    public ApiResponse<FlightResponse> updateFlight(
            @PathVariable Long id,
            @Valid @RequestBody CreateFlightRequest request) {

        return flightService.updateFlight(id, request);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteFlight(@PathVariable Long id) {

        return flightService.deleteFlight(id);
    }
}
