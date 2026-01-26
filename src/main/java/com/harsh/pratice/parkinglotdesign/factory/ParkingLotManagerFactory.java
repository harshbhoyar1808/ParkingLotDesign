package com.harsh.pratice.parkinglotdesign.factory;

import com.harsh.pratice.parkinglotdesign.factory.manager.BikeSlotManager;
import com.harsh.pratice.parkinglotdesign.factory.manager.CarSlotManager;
import com.harsh.pratice.parkinglotdesign.factory.manager.ParkingLotManager;
import com.harsh.pratice.parkinglotdesign.model.ParkingSlot;
import com.harsh.pratice.parkinglotdesign.model.Vehicle;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.harsh.pratice.parkinglotdesign.model.VehicleType.BIKE;
import static com.harsh.pratice.parkinglotdesign.model.VehicleType.CAR;

public final class ParkingLotManagerFactory {
    public static int CAR_SLOT_COUNT = 50;
    public static int BIKE_SLOT_COUNT = 50;
    public static List<ParkingSlot> carParkingSpots = Collections.unmodifiableList( createParkingSpots(CAR_SLOT_COUNT));
    public static List<ParkingSlot> bikeParkingSpots = Collections.unmodifiableList( createParkingSpots(BIKE_SLOT_COUNT));

    public static ParkingLotManager getParkingLotManager(Vehicle vehicle) {
        final var vehicleType = vehicle.getVehicleType();
        return switch(vehicleType) {
            case CAR -> new CarSlotManager(carParkingSpots);
            case BIKE -> new BikeSlotManager(bikeParkingSpots);
            default -> throw new IllegalArgumentException("Unknown Vehicle Type");
        };        
    }

    private static List<ParkingSlot> createParkingSpots(int count) {
        List<ParkingSlot> parkingSpots = new ArrayList<>();
        for(int i = 1; i <= count; i++) {
            parkingSpots.add(new ParkingSlot(i));
        }
        return parkingSpots;
    }
}
