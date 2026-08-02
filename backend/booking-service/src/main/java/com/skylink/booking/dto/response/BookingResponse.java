package com.skylink.booking.dto.response;

import com.skylink.booking.entity.BookingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;

    private Long userId;

    private Long flightId;

    private Integer seatsBooked;

    private BigDecimal totalFare;

    private BookingStatus status;

    private LocalDateTime bookingTime;
}