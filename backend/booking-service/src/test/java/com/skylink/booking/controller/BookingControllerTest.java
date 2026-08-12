package com.skylink.booking.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skylink.booking.dto.request.CreateBookingRequest;
import com.skylink.booking.dto.response.ApiResponse;
import com.skylink.booking.dto.response.BookingResponse;
import com.skylink.booking.service.BookingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = BookingController.class)
@AutoConfigureMockMvc(addFilters = false)
public class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookingService bookingService;

    @Test
    void createBooking_Success() throws Exception {
        CreateBookingRequest request = new CreateBookingRequest(1L, 2L, 2);
        BookingResponse response = BookingResponse.builder().id(10L).userId(1L).flightId(2L).build();
        
        ApiResponse<BookingResponse> apiResponse = ApiResponse.<BookingResponse>builder()
                .success(true).data(response).build();

        when(bookingService.createBooking(any(CreateBookingRequest.class))).thenReturn(apiResponse);

        mockMvc.perform(post("/api/v1/bookings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(10));
    }

    @Test
    void getBookingById_Success() throws Exception {
        BookingResponse response = BookingResponse.builder().id(10L).userId(1L).flightId(2L).build();
        ApiResponse<BookingResponse> apiResponse = ApiResponse.<BookingResponse>builder().success(true).data(response).build();

        when(bookingService.getBookingById(anyLong())).thenReturn(apiResponse);

        mockMvc.perform(get("/api/v1/bookings/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(10));
    }

    @Test
    void getAllBookings_Success() throws Exception {
        BookingResponse response = BookingResponse.builder().id(10L).userId(1L).flightId(2L).build();
        ApiResponse<List<BookingResponse>> apiResponse = ApiResponse.<List<BookingResponse>>builder().success(true).data(List.of(response)).build();

        when(bookingService.getAllBookings()).thenReturn(apiResponse);

        mockMvc.perform(get("/api/v1/bookings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(10));
    }

    @Test
    void cancelBooking_Success() throws Exception {
        ApiResponse<String> apiResponse = ApiResponse.<String>builder().success(true).data("Booking Cancelled").build();

        when(bookingService.cancelBooking(anyLong())).thenReturn(apiResponse);

        mockMvc.perform(patch("/api/v1/bookings/10/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value("Booking Cancelled"));
    }
}
