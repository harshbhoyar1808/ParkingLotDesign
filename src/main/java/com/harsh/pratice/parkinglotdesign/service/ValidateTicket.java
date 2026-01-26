package com.harsh.pratice.parkinglotdesign.service;

import com.harsh.pratice.parkinglotdesign.factory.manager.ParkingLotManager;
import com.harsh.pratice.parkinglotdesign.model.Ticket;

public class ValidateTicket {
    public boolean validateTicket(final Ticket ticket, final ParkingLotManager parkingLotManager) {
        // Implement ticket validation logic here
        final var spotDetails = parkingLotManager.getSlotStatus(ticket.getSlotNumber());
        if(spotDetails.isOccupied()){
            if(ticket.getParkingSlot().getParkedVehicle().get().getVehicleNumber().equalsIgnoreCase(spotDetails.getParkedVehicle().get().getVehicleNumber())){
                return true;
            }
        }
        return false;
    }
}
