package com.skylink.flight.exception;

public class InsufficientSeatsException extends RuntimeException {

    public InsufficientSeatsException(String message) {
        super(message);
    }
}