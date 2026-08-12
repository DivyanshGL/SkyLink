package com.skylink.payment.service;

import com.skylink.payment.entity.Payment;
import com.skylink.payment.entity.PaymentStatus;
import com.skylink.payment.kafka.event.BookingEvent;
import com.skylink.payment.kafka.event.PaymentEvent;
import com.skylink.payment.kafka.producer.PaymentProducer;
import com.skylink.payment.repository.PaymentRepository;
import com.skylink.payment.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentProducer paymentProducer;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @Test
    void processPayment_Success() {
        BookingEvent event = BookingEvent.builder()
                .bookingId(1L)
                .totalFare(new BigDecimal("199.99"))
                .email("test@example.com")
                .build();

        Payment savedPayment = Payment.builder()
                .id(1L)
                .bookingId(1L)
                .amount(new BigDecimal("199.99"))
                .transactionId("txn-123")
                .paymentStatus(PaymentStatus.SUCCESS)
                .build();

        when(paymentRepository.save(any(Payment.class))).thenReturn(savedPayment);
        doNothing().when(paymentProducer).publishPaymentCompleted(any(PaymentEvent.class));

        paymentService.processPayment(event);

        verify(paymentRepository, times(1)).save(any(Payment.class));
        verify(paymentProducer, times(1)).publishPaymentCompleted(any(PaymentEvent.class));
    }
}
