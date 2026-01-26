package com.harsh.pratice.parkinglotdesign.service;


import com.harsh.pratice.parkinglotdesign.model.ParkingSlot;
import com.harsh.pratice.parkinglotdesign.model.Ticket;

import java.time.LocalDateTime;

public class TicketGenerator {
    public static Ticket generateTicketNumber(final ParkingSlot parkingSlot) {
        final var ticket = new Ticket(LocalDateTime.now(),parkingSlot.getSlotNumber(),parkingSlot);
        return ticket;
    }
}
