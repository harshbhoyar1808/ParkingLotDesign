package com.harsh.pratice.parkinglotdesign.service;

import com.harsh.pratice.parkinglotdesign.factory.ParkingLotManagerFactory;
import com.harsh.pratice.parkinglotdesign.model.SpotDetails;
import com.harsh.pratice.parkinglotdesign.model.Ticket;
import com.harsh.pratice.parkinglotdesign.model.Vehicle;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class ParkingLotDesignService {

    private final CostCalculator costCalculator = new CostCalculator();

    public Ticket registerVehicleEntry(final Vehicle vehicle) {
        // Get the parking slot manager as per vehicle type,
        // fetch a free slot ,if not then throw exception
        //else create a ticket with entry time and slot details
        var parkingLotManager = ParkingLotManagerFactory.getParkingLotManager(vehicle);
        int slot = parkingLotManager.getParkingSpot();
        if(Objects.isNull(slot) || slot <= 0) {
            throw new IllegalStateException("No parking spot available");
        }
        // book the slot
        final var parkingSlot = parkingLotManager.registerParkingSpot(slot,vehicle);
        //get the ticket
        if(parkingSlot.getSlotNumber() == -1) {
            throw new IllegalStateException("Error in booking the slot");
        }
        final var ticket = TicketGenerator.generateTicketNumber(parkingSlot);

        return ticket;
    }
    public int registerVehicleExit(final Ticket ticket) {
        //get the parking slot manager as per vehicle type from ticket
        final var parkingLotManager = ParkingLotManagerFactory.getParkingLotManager(ticket.getParkingSlot().getParkedVehicle().get());
        //get the total parking time from ticket
        final var totalTime = Duration.between(ticket.getInTime(), LocalDateTime.now());

        // calculate the amount to be paid
        final var amount = costCalculator.calculateCost(ticket.getParkingSlot().getParkedVehicle().get().getVehicleType(), totalTime);
        // free the slot
        parkingLotManager.releaseParkingSpot(ticket.getParkingSlot().getSlotNumber());


        return amount;
    }

    public SpotDetails getParkingLotStatus() {
       final var carManager = ParkingLotManagerFactory.getParkingLotManager(new Vehicle("TEMP_CAR", com.harsh.pratice.parkinglotdesign.model.VehicleType.CAR));
       final var bikeManager = ParkingLotManagerFactory.getParkingLotManager(new Vehicle("TEMP_BIKE", com.harsh.pratice.parkinglotdesign.model.VehicleType.BIKE));

       final var carSpot = carManager.getAllSpotsDetails();
       final var bikeSpot = bikeManager.getAllSpotsDetails();
       return new SpotDetails(carSpot,bikeSpot);
    }
    public SpotDetails getSlotStatus(final int slotNumber){
        final var carManager = ParkingLotManagerFactory.getParkingLotManager(new Vehicle("TEMP_CAR", com.harsh.pratice.parkinglotdesign.model.VehicleType.CAR));
        final var bikeManager = ParkingLotManagerFactory.getParkingLotManager(new Vehicle("TEMP_BIKE", com.harsh.pratice.parkinglotdesign.model.VehicleType.BIKE));

        final var carStatus = carManager.getSlotStatus(slotNumber);
        final var bikeStatus = bikeManager.getSlotStatus(slotNumber);
        return new SpotDetails(List.of(carStatus),List.of(bikeStatus));

    }
}
