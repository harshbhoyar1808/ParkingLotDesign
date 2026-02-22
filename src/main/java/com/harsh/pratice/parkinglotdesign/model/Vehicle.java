package com.harsh.pratice.parkinglotdesign.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@SuperBuilder
public class Vehicle {
    private String vehicleNumber;
    private VehicleType vehicleType;
    public Vehicle(){
        this.vehicleNumber = "";
        this.vehicleType = VehicleType.NULL;
    }
}
