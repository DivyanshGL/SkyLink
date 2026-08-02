package com.skylink.notification.kafka.consumer;

import com.skylink.notification.kafka.event.BookingEvent;
import com.skylink.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "booking.created",
            groupId = "notification-group"
    )
    public void consumeBookingCreated(BookingEvent event){

        notificationService.sendBookingConfirmation(event);

    }

}