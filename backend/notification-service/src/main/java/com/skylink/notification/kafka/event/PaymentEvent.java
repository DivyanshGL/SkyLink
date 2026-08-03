package com.skylink.notification.kafka.event;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PaymentEvent {

    private Long paymentId;

    private Long bookingId;

    private BigDecimal amount;

    private String transactionId;

    private String status;

    private String email;

}