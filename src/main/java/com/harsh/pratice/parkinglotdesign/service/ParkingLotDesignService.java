package com.harsh.pratice.parkinglotdesign.service;

import com.harsh.pratice.parkinglotdesign.factory.ParkingLotManagerFactory;
import com.harsh.pratice.parkinglotdesign.model.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ParkingLotDesignService {

    private final CostCalculator costCalculator = new CostCalculator();
    private final ValidateTicket validateTicket = new ValidateTicket();

    public Ticket registerVehicleEntry(final Vehicle vehicle) {

        var parkingLotManager = ParkingLotManagerFactory.getParkingLotManager(vehicle);
        int slot = parkingLotManager.getParkingSpot();
        if(slot <= 0) {
            throw new IllegalStateException("No parking spot available");
        }
        // book the slot
        final var parkingSlot = parkingLotManager.registerParkingSpot(slot,vehicle);
        //get the ticket
        if(parkingSlot.getSlotNumber() == -1) {
            throw new IllegalStateException("Error in booking the slot");
        }
        return TicketGenerator.generateTicketNumber(parkingSlot);
    }

    public Bill registerVehicleExit(final Vehicle vehicle) {
        //get the parking slot manager as per vehicle type from ticket
        final var parkingLotManager = ParkingLotManagerFactory.getParkingLotManager(vehicle);
        double amount= -1;
        String message = "Invalid Ticket";
        if( validateTicket.validateTicket(vehicle, parkingLotManager)) {
            //get the total parking time from ticket
            final var slotDetails = getSlotDetails(vehicle);
            final var totalTime = Duration.between(LocalDateTime.parse(slotDetails.getIntime()), LocalDateTime.now());

            // calculate the amount to be paid
             amount = costCalculator.calculateCost(vehicle.getVehicleType(), totalTime);
             message = "Please pay the amount: ";
            // free the slot
            parkingLotManager.releaseParkingSpot(slotDetails.getSlotNumber());
        }

        return new Bill(amount, message);
    }

    public List<ParkingLotStatus> getParkingLotStatus() {
       final var carManager = ParkingLotManagerFactory.getParkingLotManager(new Vehicle("TEMP_CAR", com.harsh.pratice.parkinglotdesign.model.VehicleType.CAR));
       final var bikeManager = ParkingLotManagerFactory.getParkingLotManager(new Vehicle("TEMP_BIKE", com.harsh.pratice.parkinglotdesign.model.VehicleType.BIKE));

       final var carSpot = carManager.getAllSpotsDetails();
       final var bikeSpot =bikeManager.getAllSpotsDetails();
       return List.of(carSpot,bikeSpot);
    }
    public SpotDetails getSlotStatus(){
        final var carManager = ParkingLotManagerFactory.getParkingLotManager(new Vehicle("TEMP_CAR", com.harsh.pratice.parkinglotdesign.model.VehicleType.CAR));
        final var bikeManager = ParkingLotManagerFactory.getParkingLotManager(new Vehicle("TEMP_BIKE", com.harsh.pratice.parkinglotdesign.model.VehicleType.BIKE));

        final var carStatus = carManager.getSlotStatus();
        final var bikeStatus = bikeManager.getSlotStatus();
        return new SpotDetails(carStatus,bikeStatus);

    }
    public ParkingSlot getSlotDetails( final Vehicle vehicle){
        final var parkingLotManager = ParkingLotManagerFactory.getParkingLotManager(vehicle);
        final var parkingSlotDetailsList = parkingLotManager.getSlotList();
        return parkingSlotDetailsList.stream()
                .filter(slot -> slot.isOccupied()
                        && slot.getParkedVehicle().get().getVehicleNumber().equals(vehicle.getVehicleNumber()))
                .findFirst()
                .orElse(new ParkingSlot());
     }
}
