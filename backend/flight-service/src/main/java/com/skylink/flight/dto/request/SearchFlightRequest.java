package com.skylink.flight.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchFlightRequest {

    @NotBlank
    private String source;

    @NotBlank
    private String destination;

    @NotNull
    private LocalDate travelDate;
}