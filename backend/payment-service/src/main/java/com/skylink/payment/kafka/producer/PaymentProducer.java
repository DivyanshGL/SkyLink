package com.skylink.payment.kafka.producer;

import com.skylink.payment.kafka.event.PaymentEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentProducer {

    private final KafkaTemplate<String, PaymentEvent> kafkaTemplate;

    public void publishPaymentCompleted(PaymentEvent event) {

        kafkaTemplate.send("payment.completed", event);

    }

    public void publishPaymentFailed(PaymentEvent event) {

        kafkaTemplate.send("payment.failed", event);

    }

}