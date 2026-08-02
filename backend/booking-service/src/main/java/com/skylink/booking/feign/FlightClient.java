package com.skylink.booking.feign;

import com.skylink.booking.dto.response.ApiResponse;
import com.skylink.booking.feign.request.ReleaseSeatRequest;
import com.skylink.booking.feign.request.ReserveSeatRequest;
import com.skylink.booking.feign.response.FlightResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "flight-service")
public interface FlightClient {

    @GetMapping("/api/v1/flights/{id}")
    ApiResponse<FlightResponse> getFlightById(@PathVariable Long id);

    @PostMapping("/api/v1/flights/{id}/reserve")
    ApiResponse<String> reserveSeats(
            @PathVariable Long id,
            @RequestBody ReserveSeatRequest request
    );

    @PostMapping("/api/v1/flights/{id}/release")
    ApiResponse<String> releaseSeats(
            @PathVariable Long id,
            @RequestBody ReleaseSeatRequest request
    );

}