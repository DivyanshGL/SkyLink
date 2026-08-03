package com.skylink.booking.kafka.event;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingEvent {

    private Long bookingId;

    private Long userId;

    private Long flightId;

    private Integer seatsBooked;

    private BigDecimal totalFare;

    private String status;

    private String email;
}