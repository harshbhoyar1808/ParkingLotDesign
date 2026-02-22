package com.harsh.pratice.parkinglotdesign.factory.manager;

import com.harsh.pratice.parkinglotdesign.model.ParkingLotStatus;
import com.harsh.pratice.parkinglotdesign.model.ParkingSlot;
import com.harsh.pratice.parkinglotdesign.model.Vehicle;

import java.util.List;

public interface ParkingLotManager {
    int getParkingSpot();
    boolean releaseParkingSpot(int spotNumber);
    ParkingSlot registerParkingSpot(int spotNumber, Vehicle vehicle);
    ParkingLotStatus getAllSpotsDetails();
    List<ParkingSlot> getSlotStatus();
    List<ParkingSlot> getSlotList();
}
