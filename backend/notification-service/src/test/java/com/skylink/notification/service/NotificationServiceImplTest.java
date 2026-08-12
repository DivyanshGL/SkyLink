package com.skylink.notification.service;

import com.skylink.notification.kafka.event.BookingEvent;
import com.skylink.notification.kafka.event.PaymentEvent;
import com.skylink.notification.service.impl.NotificationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceImplTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    @Test
    void sendBookingConfirmation_BookingEvent_Success() {
        BookingEvent event = new BookingEvent();
        event.setBookingId(1L);
        event.setUserId(2L);
        event.setFlightId(3L);
        event.setSeatsBooked(2);
        event.setTotalFare(new BigDecimal("199.99"));
        event.setStatus("PENDING_PAYMENT");

        notificationService.sendBookingConfirmation(event);

        // This method just logs, no interactions to verify with mocks right now
    }

    @Test
    void sendBookingConfirmation_PaymentEvent_Success() {
        PaymentEvent event = new PaymentEvent();
        event.setBookingId(1L);
        event.setAmount(new BigDecimal("199.99"));
        event.setTransactionId("txn-123");
        event.setStatus("SUCCESS");
        event.setEmail("test@example.com");

        notificationService.sendBookingConfirmation(event);

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendPaymentFailure_Success() {
        PaymentEvent event = new PaymentEvent();
        event.setBookingId(1L);
        event.setStatus("FAILED");
        event.setEmail("test@example.com");

        notificationService.sendPaymentFailure(event);

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}
