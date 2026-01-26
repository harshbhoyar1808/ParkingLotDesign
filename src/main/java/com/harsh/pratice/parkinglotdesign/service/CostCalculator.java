package com.harsh.pratice.parkinglotdesign.service;


import com.harsh.pratice.parkinglotdesign.model.VehicleType;

import java.time.Duration;

public class CostCalculator {
    private static final int RATE_PER_HOUR_CAR = 20;
    private static final int RATE_PER_HOUR_BIKE = 10;

    public int calculateCost(VehicleType vehicleType, Duration totalTimeMillis) {
        int ratePerHour = 0;
        switch (vehicleType) {
            case CAR:
                ratePerHour = RATE_PER_HOUR_CAR;
                break;
            case BIKE:
                ratePerHour = RATE_PER_HOUR_BIKE;
                break;
            default:
                throw new IllegalArgumentException("Unsupported vehicle type");
        }
        long totalHours = totalTimeMillis.toMillis() / 3600000;
        if (totalTimeMillis.toMillis() % 3600000 != 0) {
            totalHours++;
        }
        return (int) (totalHours * ratePerHour);
    }
    
}
