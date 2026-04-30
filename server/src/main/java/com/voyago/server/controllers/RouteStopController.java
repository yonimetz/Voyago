package com.voyago.server.controllers;

import com.voyago.server.models.RouteStop;
import com.voyago.server.services.RouteStopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stops")
@CrossOrigin(origins = "http://localhost:5173")
public class RouteStopController {

    @Autowired
    private RouteStopService routeStopService;

    @GetMapping("/day/{dayId}")
    public List<RouteStop> getStopsByDayId(@PathVariable Long dayId) {
        return routeStopService.getStopsByDayId(dayId);
    }

    @PostMapping
    public RouteStop createStop(@RequestBody RouteStop stop) {
        return routeStopService.saveStop(stop);
    }
}