package com.skylink.notification.service;

import com.skylink.notification.kafka.event.BookingEvent;
import com.skylink.notification.kafka.event.PaymentEvent;

public interface NotificationService {

    void sendBookingConfirmation(BookingEvent event);

    void sendBookingConfirmation(PaymentEvent event);

    void sendPaymentFailure(PaymentEvent event);

}