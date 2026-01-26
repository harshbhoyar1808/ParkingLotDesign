package com.harsh.pratice.parkinglotdesign.controller;

import com.harsh.pratice.parkinglotdesign.model.*;
import com.harsh.pratice.parkinglotdesign.service.ParkingLotDesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Controller
public class ParkingLotSystemController {

    private ParkingLotDesignService parkingLotDesignService = new ParkingLotDesignService();

    @PostMapping(
            value = "/getTicket"
    )
    public ResponseEntity<Ticket> getParkingLotSystem(@RequestBody final Vehicle vehicle){
    final var ticket = parkingLotDesignService.registerVehicleEntry(vehicle);
    return ResponseEntity.ok( ticket);
    }

    @PostMapping(
            value = "/billTicket"
    )
    public ResponseEntity<Bill> getBillingService(@RequestBody final Ticket ticket){
        final var amount = parkingLotDesignService.registerVehicleExit(ticket);
        return ResponseEntity.ok(amount);
    }

    @GetMapping(
            value = "/getSlotStatus"
    )
    public ResponseEntity<SpotDetails> getSlotStatus(@RequestHeader final int spotNumber){
        return ResponseEntity.ok(parkingLotDesignService.getSlotStatus(spotNumber));
    }
    @GetMapping(
            value = "/getParkingSlotStatus"
    )
    public ResponseEntity<SpotDetails> getParkingLotInfo(){
        return ResponseEntity.ok(parkingLotDesignService.getParkingLotStatus());
    }

}
