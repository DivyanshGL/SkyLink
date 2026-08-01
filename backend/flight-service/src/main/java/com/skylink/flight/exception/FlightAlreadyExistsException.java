package com.skylink.flight.exception;

public class FlightAlreadyExistsException extends RuntimeException {

    public FlightAlreadyExistsException(String message) {
        super(message);
    }
}