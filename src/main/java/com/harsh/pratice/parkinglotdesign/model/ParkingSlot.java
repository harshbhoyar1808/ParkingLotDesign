package com.harsh.pratice.parkinglotdesign.model;
import lombok.Data;
import lombok.NonNull;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicReference;

@Data
public class ParkingSlot {
    private int slotNumber;
    private boolean isOccupied;
    private String intime;
    @NonNull
    private AtomicReference<Vehicle> parkedVehicle = new AtomicReference<>(null);
    public ParkingSlot(int slotNumber) {
        this.slotNumber = slotNumber;
        this.isOccupied = false;
    }
    public ParkingSlot(int slotNumber, boolean isOccupied, AtomicReference<Vehicle> parkedVehicle) {
        this.slotNumber = slotNumber;
        this.isOccupied = isOccupied;
        this.intime = LocalDateTime.now().toString();
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
