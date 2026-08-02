package com.skylink.booking.kafka.producer;

import com.skylink.booking.kafka.event.BookingEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingProducer {

    private final KafkaTemplate<String, BookingEvent> kafkaTemplate;

    public void publishBookingCreated(BookingEvent event){

        kafkaTemplate.send("booking.created", event);

        System.out.println("========== EVENT PUBLISHED ==========");
        System.out.println(event);
    }

    public void publishBookingCancelled(BookingEvent event){

        kafkaTemplate.send("booking.cancelled", event);
    }
}