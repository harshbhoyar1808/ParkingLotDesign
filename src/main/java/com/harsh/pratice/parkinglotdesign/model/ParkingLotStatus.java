package com.harsh.pratice.parkinglotdesign.model;

import lombok.Data;

@Data
public class ParkingLotStatus {
    private String vehicleType;
    private int totalSpots;
    private int occupiedSpots;
    private int availableSpots;

    public ParkingLotStatus(final String vehicleType, final int totalSpots,final int occupiedSpots,final int availableSpots) {
        this.vehicleType = vehicleType;
        this.totalSpots = totalSpots;
        this.occupiedSpots = occupiedSpots;
        this.availableSpots = availableSpots;
    }
}
