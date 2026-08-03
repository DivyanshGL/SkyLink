package com.skylink.payment.service.impl;

import com.skylink.payment.entity.Payment;
import com.skylink.payment.entity.PaymentStatus;
import com.skylink.payment.kafka.event.BookingEvent;
import com.skylink.payment.kafka.event.PaymentEvent;
import com.skylink.payment.kafka.producer.PaymentProducer;
import com.skylink.payment.repository.PaymentRepository;
import com.skylink.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentProducer paymentProducer;

    @Override
    public void processPayment(BookingEvent event) {
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        Payment payment = Payment.builder()
                .bookingId(event.getBookingId())
                .amount(event.getTotalFare())
                .paymentMethod("CARD")
                .paymentStatus(PaymentStatus.SUCCESS)
                .transactionId(UUID.randomUUID().toString())
                .paymentTime(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        PaymentEvent paymentEvent = PaymentEvent.builder()
                .paymentId(savedPayment.getId())
                .bookingId(savedPayment.getBookingId())
                .amount(savedPayment.getAmount())
                .transactionId(savedPayment.getTransactionId())
                .status(savedPayment.getPaymentStatus().name())
                .email(event.getEmail())
                .build();

        paymentProducer.publishPaymentCompleted(paymentEvent);

        System.out.println("========== PAYMENT COMPLETED ==========");
        System.out.println(paymentEvent);

    }
}