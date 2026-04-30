package com.voyago.server.controllers;

import com.voyago.server.models.TripDay;
import com.voyago.server.services.TripDayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/days")
@CrossOrigin(origins = "http://localhost:5173")
public class TripDayController {

    @Autowired
    private TripDayService tripDayService;

    @GetMapping("/trip/{tripId}")
    public List<TripDay> getDaysByTripId(@PathVariable Long tripId) {
        return tripDayService.getDaysByTripId(tripId);
    }

    @PostMapping
    public TripDay createDay(@RequestBody TripDay day) {
        return tripDayService.saveTripDay(day);
    }
}