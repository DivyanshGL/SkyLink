package com.skylink.booking.feign.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReserveSeatRequest {

    @NotNull(message = "Seats are required")
    @Min(value = 1, message = "Seats must be at least 1")
    private Integer seats;
}
