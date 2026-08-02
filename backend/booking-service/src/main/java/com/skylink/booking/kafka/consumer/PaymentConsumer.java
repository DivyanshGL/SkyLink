package com.skylink.booking.kafka.consumer;

import com.skylink.booking.kafka.event.PaymentEvent;
import com.skylink.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentConsumer {

    private final BookingService bookingService;

    @KafkaListener(
            topics = "payment.completed",
            groupId = "booking-group"
    )
    public void consumePaymentCompleted(PaymentEvent event) {

        bookingService.confirmBooking(event);

    }

    @KafkaListener(
            topics = "payment.failed",
            groupId = "booking-group"
    )
    public void consumePaymentFailed(PaymentEvent event) {

        bookingService.failBooking(event);

    }

}