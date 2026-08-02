package com.skylink.payment.service;

import com.skylink.payment.kafka.event.BookingEvent;

public interface PaymentService {

    void processPayment(BookingEvent event);

}