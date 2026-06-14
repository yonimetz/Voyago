package com.voyago.server.controllers;

import com.voyago.server.models.RouteStop;
import com.voyago.server.services.RouteStopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PutMapping("/{stopId}/note")
    public ResponseEntity<?> updatePersonalNote(@PathVariable Long stopId, @RequestBody Map<String, String> request) {
        String note = request.get("note");
        RouteStop updatedStop = routeStopService.updatePersonalNote(stopId, note);

        if (updatedStop != null) {
            return ResponseEntity.ok(Map.of("message", "Note saved successfully"));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Stop not found"));
        }
    }
}