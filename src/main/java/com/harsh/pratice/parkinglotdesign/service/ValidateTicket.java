package com.harsh.pratice.parkinglotdesign.service;

import com.harsh.pratice.parkinglotdesign.factory.manager.ParkingLotManager;
import com.harsh.pratice.parkinglotdesign.model.Ticket;
import com.harsh.pratice.parkinglotdesign.model.Vehicle;

public class ValidateTicket {
    public boolean validateTicket(final Vehicle vehicle, final ParkingLotManager parkingLotManager) {
        // Implement ticket validation logic here
        final var allSpots = parkingLotManager.getSlotList();
        for(var spot : allSpots) {
            if(spot.isOccupied() && spot.getParkedVehicle().get().getVehicleNumber().equalsIgnoreCase(vehicle.getVehicleNumber())) {
                return true;
            }
        }
        return false;
    }
}
