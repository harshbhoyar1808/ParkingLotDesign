package com.harsh.pratice.parkinglotdesign.model;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class Vehicle {
    private String vehicleNumber;
    private VehicleType vehicleType;
    public Vehicle(){
        this.vehicleNumber = "";
        this.vehicleType = VehicleType.NULL;
    }
}
