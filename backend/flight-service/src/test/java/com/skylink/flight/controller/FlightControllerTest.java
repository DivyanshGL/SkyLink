package com.skylink.flight.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skylink.flight.dto.request.CreateFlightRequest;
import com.skylink.flight.dto.request.ReleaseSeatRequest;
import com.skylink.flight.dto.request.ReserveSeatRequest;
import com.skylink.flight.dto.request.SearchFlightRequest;
import com.skylink.flight.dto.response.ApiResponse;
import com.skylink.flight.dto.response.FlightResponse;
import com.skylink.flight.service.FlightService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = FlightController.class)
@AutoConfigureMockMvc(addFilters = false)
public class FlightControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FlightService flightService;

    @Test
    void addFlight_Success() throws Exception {
        CreateFlightRequest request = new CreateFlightRequest(
                "SK101", "SkyLink Air", "NYC", "LAX",
                LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(1).plusHours(5),
                new BigDecimal("199.99"), 150
        );

        FlightResponse response = FlightResponse.builder()
                .id(1L)
                .flightNumber("SK101")
                .availableSeats(150)
                .build();

        ApiResponse<FlightResponse> apiResponse = ApiResponse.<FlightResponse>builder()
                .success(true)
                .data(response)
                .build();

        when(flightService.addFlight(any(CreateFlightRequest.class))).thenReturn(apiResponse);

        mockMvc.perform(post("/api/v1/flights")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.flightNumber").value("SK101"));
    }

    @Test
    void getAllFlights_Success() throws Exception {
        FlightResponse response = FlightResponse.builder().id(1L).flightNumber("SK101").build();
        ApiResponse<List<FlightResponse>> apiResponse = ApiResponse.<List<FlightResponse>>builder().success(true).data(List.of(response)).build();

        when(flightService.getAllFlights()).thenReturn(apiResponse);

        mockMvc.perform(get("/api/v1/flights"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].flightNumber").value("SK101"));
    }

    @Test
    void searchFlights_Success() throws Exception {
        SearchFlightRequest request = new SearchFlightRequest("NYC", "LAX", LocalDate.now().plusDays(1));
        FlightResponse response = FlightResponse.builder().id(1L).flightNumber("SK101").build();
        ApiResponse<List<FlightResponse>> apiResponse = ApiResponse.<List<FlightResponse>>builder().success(true).data(List.of(response)).build();

        when(flightService.searchFlights(any(SearchFlightRequest.class))).thenReturn(apiResponse);

        mockMvc.perform(post("/api/v1/flights/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
