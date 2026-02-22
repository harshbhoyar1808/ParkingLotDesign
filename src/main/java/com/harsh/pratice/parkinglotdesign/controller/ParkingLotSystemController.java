package com.harsh.pratice.parkinglotdesign.controller;

import com.harsh.pratice.parkinglotdesign.model.*;
import com.harsh.pratice.parkinglotdesign.service.ParkingLotDesignService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Controller
public class ParkingLotSystemController {

    private final ParkingLotDesignService parkingLotDesignService = new ParkingLotDesignService();

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
    public ResponseEntity<Bill> getBillingService(@RequestBody final Vehicle vehicle){
        final var amount = parkingLotDesignService.registerVehicleExit(vehicle);
        return ResponseEntity.ok(amount);
    }

    @GetMapping(
            value = "/getSlotStatus"
    )
    public ResponseEntity<SpotDetails> getSlotStatus(){
        return ResponseEntity.ok(parkingLotDesignService.getSlotStatus());
    }
    @GetMapping(
            value = "/getParkingSlotStatus"
    )
    public ResponseEntity<List<ParkingLotStatus>> getParkingLotInfo(){
        return ResponseEntity.ok(parkingLotDesignService.getParkingLotStatus());
    }

}
