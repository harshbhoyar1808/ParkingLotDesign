
package com.harsh.pratice.parkinglotdesign.model;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class Ticket {
    private LocalDateTime inTime;
    private int slotNumber;
    private ParkingSlot parkingSlot;

    public Ticket(LocalDateTime inTime, int slotNumber, ParkingSlot parkingSlot) {
        this.inTime = inTime;
        this.slotNumber = slotNumber;
        this.parkingSlot = parkingSlot;
    }
    public Ticket(){
        this.inTime = LocalDateTime.now();
        this.slotNumber = -1;
        this.parkingSlot = new ParkingSlot();
    }
}