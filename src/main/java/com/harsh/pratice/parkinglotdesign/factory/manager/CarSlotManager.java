package com.harsh.pratice.parkinglotdesign.factory.manager;


import com.harsh.pratice.parkinglotdesign.model.ParkingLotStatus;
import com.harsh.pratice.parkinglotdesign.model.ParkingSlot;
import com.harsh.pratice.parkinglotdesign.model.Vehicle;
import com.harsh.pratice.parkinglotdesign.model.VehicleType;

import java.time.LocalDateTime;
import java.util.List;

public class CarSlotManager implements ParkingLotManager {
    
    List<ParkingSlot> parkingSlots;
    Vehicle nullVehicle = new Vehicle("NO_VEHICLE", VehicleType.NULL); 
    
    public CarSlotManager(List<ParkingSlot> parkingSlots) {
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
                spot.setIntime(null);
                return true;
            }
        }
        return false;
    }
    @Override 
    public ParkingSlot registerParkingSpot(int spotNumber, Vehicle vehicle){
        for (ParkingSlot spot : parkingSlots) {
            if (spot.getSlotNumber() == spotNumber) {
                if (spot.isOccupied()) {
                    throw new UnsupportedOperationException("Parking spot " + spotNumber + " is already occupied");
                }
                spot.setOccupied(true);
                spot.setIntime(LocalDateTime.now().toString());
                spot.occupy(vehicle);
                return spot;
            }
        }
        return new ParkingSlot();
    }

    @Override
    public ParkingLotStatus getAllSpotsDetails(){
        final var totalSpots = parkingSlots.size();
        final var occupiedSpots = parkingSlots.stream().filter(ParkingSlot::isOccupied).count();
        final var availableSpots = totalSpots - occupiedSpots;

        return new ParkingLotStatus(VehicleType.CAR.name(), totalSpots, (int) occupiedSpots, (int) availableSpots);
    }
    @Override
    public List<ParkingSlot> getSlotStatus(){
        final var occupiedSpots = parkingSlots.stream().filter(ParkingSlot::isOccupied).toList();
        return List.copyOf(occupiedSpots);
    }
    @Override
    public List<ParkingSlot> getSlotList(){
        return  this.parkingSlots;
    }
}