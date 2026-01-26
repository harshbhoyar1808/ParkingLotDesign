package com.harsh.pratice.parkinglotdesign.model;
import lombok.Data;

import java.util.concurrent.atomic.AtomicReference;

@Data
public class ParkingSlot {
    private int slotNumber;
    private boolean isOccupied;
    private AtomicReference<Vehicle> parkedVehicle = new AtomicReference<>(null);
    public ParkingSlot(int slotNumber) {
        this.slotNumber = slotNumber;
        this.isOccupied = false;
    }
    public ParkingSlot(int slotNumber, boolean isOccupied, AtomicReference<Vehicle> parkedVehicle) {
        this.slotNumber = slotNumber;
        this.isOccupied = isOccupied;
        this.setParkedVehicle(parkedVehicle);
    }
    public ParkingSlot() {
        this.slotNumber = -1;
        this.isOccupied = false;
    }
    public void occupy(Vehicle vehicle) {
        this.parkedVehicle.set(vehicle);
    }
    public void releaseVehicle() {
        this.parkedVehicle.set(null);
    }
}
