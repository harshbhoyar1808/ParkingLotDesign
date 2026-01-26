package com.harsh.pratice.parkinglotdesign.model;

import lombok.Data;

import java.util.List;

@Data
public class SpotDetails {
    private List<ParkingSlot> carSpots;
    private List<ParkingSlot> bikeSpots;

    public SpotDetails(List<ParkingSlot> carSpots, List<ParkingSlot> bikeSpots) {
        this.carSpots = carSpots;
        this.bikeSpots = bikeSpots;
    }
}
