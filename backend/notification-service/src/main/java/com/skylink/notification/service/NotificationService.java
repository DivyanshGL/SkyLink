package com.skylink.notification.service;

import com.skylink.notification.kafka.event.BookingEvent;

public interface NotificationService {

    void sendBookingConfirmation(BookingEvent event);

}