package com.skylink.booking.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookingRequest {

    @NotNull(message = "User Id is required")
    private Long userId;

    @NotNull(message = "Flight Id is required")
    private Long flightId;

    @NotNull(message = "Seats are required")
    @Min(value = 1, message = "At least one seat must be booked")
    private Integer seatsBooked;
}