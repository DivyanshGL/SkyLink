package com.skylink.notification.service.impl;

import com.skylink.notification.kafka.event.BookingEvent;
import com.skylink.notification.kafka.event.PaymentEvent;
import com.skylink.notification.service.NotificationService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender mailSender;

    @Override
    public void sendBookingConfirmation(BookingEvent event) {

        log.info("==============================================");
        log.info("📧 Sending Booking Confirmation");
        log.info("Booking Id : {}", event.getBookingId());
        log.info("User Id    : {}", event.getUserId());
        log.info("Flight Id  : {}", event.getFlightId());
        log.info("Seats      : {}", event.getSeatsBooked());
        log.info("Fare       : {}", event.getTotalFare());
        log.info("Status     : {}", event.getStatus());
        log.info("✅ Email sent successfully (Simulation)");
        log.info("==============================================");

    }

    @Override
    public void sendBookingConfirmation(PaymentEvent event) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(event.getEmail()); // Abhi testing ke liye apna email
        message.setSubject("SkyLink - Booking Confirmed");

        message.setText("""
            Dear Customer,

            Your booking has been confirmed successfully.

            Booking ID      : %d
            Amount Paid     : ₹%s
            Transaction ID  : %s
            Status          : %s

            Thank you for choosing SkyLink.

            Regards,
            SkyLink Team
            """.formatted(
                event.getBookingId(),
                event.getAmount(),
                event.getTransactionId(),
                event.getStatus()
        ));

        mailSender.send(message);

        log.info("✅ Booking confirmation email sent successfully.");
    }

    @Override
    public void sendPaymentFailure(PaymentEvent event) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(event.getEmail());
        message.setSubject("SkyLink - Payment Failed");

        message.setText("""
            Dear Customer,

            Your payment could not be processed.

            Booking ID : %d
            Status     : %s

            Please try again.

            Regards,
            SkyLink Team
            """.formatted(
                event.getBookingId(),
                event.getStatus()
        ));

        mailSender.send(message);

        log.info("⚠️ Payment failure email sent.");
    }

}