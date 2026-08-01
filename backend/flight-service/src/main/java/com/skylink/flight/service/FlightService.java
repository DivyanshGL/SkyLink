package com.skylink.flight.service;

import com.skylink.flight.dto.request.CreateFlightRequest;
import com.skylink.flight.dto.request.SearchFlightRequest;
import com.skylink.flight.dto.response.ApiResponse;
import com.skylink.flight.dto.response.FlightResponse;

import java.util.List;

public interface FlightService {

    ApiResponse<FlightResponse> addFlight(CreateFlightRequest request);

    ApiResponse<List<FlightResponse>> getAllFlights();

    ApiResponse<FlightResponse> getFlightById(Long id);

    ApiResponse<List<FlightResponse>> searchFlights(SearchFlightRequest request);

    ApiResponse<FlightResponse> updateFlight(Long id, CreateFlightRequest request);

    ApiResponse<String> deleteFlight(Long id);

}