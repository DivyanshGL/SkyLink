package com.skylink.notification.service.impl;

import com.skylink.notification.kafka.event.BookingEvent;
import com.skylink.notification.kafka.event.PaymentEvent;
import com.skylink.notification.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationServiceImpl implements NotificationService {

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

        log.info("==============================================");
        log.info("📧 Sending Booking Confirmation");
        log.info("Payment Id     : {}", event.getPaymentId());
        log.info("Booking Id     : {}", event.getBookingId());
        log.info("Amount         : {}", event.getAmount());
        log.info("Transaction Id : {}", event.getTransactionId());
        log.info("Status         : {}", event.getStatus());
        log.info("✅ Email sent successfully (Simulation)");
        log.info("==============================================");

    }

    @Override
    public void sendPaymentFailure(PaymentEvent event) {

        log.info("==============================================");
        log.info("❌ Payment Failed");
        log.info("Booking Id     : {}", event.getBookingId());
        log.info("Transaction Id : {}", event.getTransactionId());
        log.info("Status         : {}", event.getStatus());
        log.info("⚠️ Payment Failure Email sent (Simulation)");
        log.info("==============================================");

    }

}