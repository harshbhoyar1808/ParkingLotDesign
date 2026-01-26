package com.harsh.pratice.parkinglotdesign.factory.manager;


import com.harsh.pratice.parkinglotdesign.model.ParkingSlot;
import com.harsh.pratice.parkinglotdesign.model.Vehicle;
import com.harsh.pratice.parkinglotdesign.model.VehicleType;

import java.util.List;

public class BikeSlotManager implements ParkingLotManager {
    
    List<ParkingSlot> parkingSlots;
    
    public BikeSlotManager(List<ParkingSlot> parkingSlots) {
        this.parkingSlots = parkingSlots;
    }

    @Override
    public int getParkingSpot(){
        return parkingSlots.stream()
                .filter(spot -> !spot.isOccupied())
                .findFirst()
                .map(ParkingSlot::getSlotNumber)
                .orElse(-1);
    }
    @Override
    public boolean releaseParkingSpot(int spotNumber){
        for(ParkingSlot spot : parkingSlots) {
            if(spot.getSlotNumber() == spotNumber) {
                spot.setOccupied(false);
                spot.releaseVehicle();
                return true;
            }
        }
        return false;
    }
    @Override 
    public ParkingSlot registerParkingSpot(int spotNumber, Vehicle vehicle){
        for(ParkingSlot spot : parkingSlots) {
            if(spot.getSlotNumber() == spotNumber) {
                spot.setOccupied(true);
                spot.occupy(vehicle);
                return spot;
            }
        }
        return new ParkingSlot();
    }

    @Override
    public List<ParkingSlot> getAllSpotsDetails(){
        return parkingSlots;
    }
    @Override
    public ParkingSlot getSlotStatus(int spotNumber) {
        for (ParkingSlot spot : parkingSlots) {
            if (spot.getSlotNumber() == spotNumber) {
                return spot;
            }
        }
        return new ParkingSlot();
    }
}