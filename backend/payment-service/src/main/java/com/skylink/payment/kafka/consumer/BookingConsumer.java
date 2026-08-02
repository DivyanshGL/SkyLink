package com.skylink.payment.kafka.consumer;

import com.skylink.payment.kafka.event.BookingEvent;
import com.skylink.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingConsumer {

    private final PaymentService paymentService;

    @KafkaListener(
            topics = "booking.created",
            groupId = "payment-group"
    )
    public void consumeBookingCreated(BookingEvent event){

        paymentService.processPayment(event);

    }

}