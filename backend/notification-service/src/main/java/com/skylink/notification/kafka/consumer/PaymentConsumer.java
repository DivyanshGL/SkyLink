package com.skylink.notification.kafka.consumer;

import com.skylink.notification.kafka.event.PaymentEvent;
import com.skylink.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "payment.completed",
            groupId = "notification-group"
    )
    public void consumePaymentCompleted(PaymentEvent event) {

        notificationService.sendBookingConfirmation(event);

    }

    @KafkaListener(
            topics = "payment.failed",
            groupId = "notification-group"
    )
    public void consumePaymentFailed(PaymentEvent event) {

        notificationService.sendPaymentFailure(event);

    }
}