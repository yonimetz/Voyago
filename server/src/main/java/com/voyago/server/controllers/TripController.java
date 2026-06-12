package com.voyago.server.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.voyago.server.dto.TripGenerationRequest;
import com.voyago.server.models.RouteStop;
import com.voyago.server.models.Trip;
import com.voyago.server.models.TripDay;
import com.voyago.server.models.User;
import com.voyago.server.repositories.UserRepository;
import com.voyago.server.services.GeminiService;
import com.voyago.server.services.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;
    private final GeminiService geminiService;
    private final UserRepository userRepository;

    public TripController(TripService tripService, GeminiService geminiService, UserRepository userRepository) {
        this.tripService = tripService;
        this.geminiService = geminiService;
        this.userRepository = userRepository;
    }

    @GetMapping("/user/{userId}")
    public List<Trip> getTripsByUserId(@PathVariable Long userId) {
        return tripService.getTripsByUserId(userId);
    }

    @PostMapping
    public Trip createTrip(@RequestBody Trip trip) {
        return tripService.saveTrip(trip);
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateTripWithAI(@RequestBody TripGenerationRequest request) {
        try {
            // 1. קודם שולפים את המשתמש ממסד הנתונים כדי לקבל את העדפות ה-AI שלו
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String preferences = user.getAiPreferences();

            // 2. קריאה ל-AI וקבלת ה-JSON הנקי - עכשיו מעבירים גם את ה-preferences (הפרמטר ה-5)
            String aiResponseJson = geminiService.generateTripPlan(
                    request.getDestination(), 
                    request.getStartDate(), 
                    request.getEndDate(), 
                    request.getStyle(),
                    preferences,
                    request.getLanguage()
            );

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(aiResponseJson);

            // 3. יצירת טיול חדש
            Trip trip = new Trip();
            trip.setDestination(rootNode.path("destination").asText());
            trip.setImageKeyword(rootNode.path("image_keyword").asText());
            trip.setStartDate(LocalDate.parse(request.getStartDate()));
            trip.setEndDate(LocalDate.parse(request.getEndDate()));
            trip.setUser(user);

            // 4. פירוק ה-JSON לימים ותחנות
            JsonNode daysNode = rootNode.path("days");
            List<TripDay> tripDays = new ArrayList<>();

            for (JsonNode dayNode : daysNode) {
                TripDay tripDay = new TripDay();
                tripDay.setDayNumber(dayNode.path("day_number").asInt());
                tripDay.setDescription("Day " + tripDay.getDayNumber() + " - " + dayNode.path("date").asText());
                tripDay.setTrip(trip); // קישור חזרה לטיול

                JsonNode stopsNode = dayNode.path("stops");
                List<RouteStop> routeStops = new ArrayList<>();

                for (JsonNode stopNode : stopsNode) {
                    RouteStop stop = new RouteStop();
                    stop.setLocationName(stopNode.path("location_name").asText());
                    stop.setVisitTime(stopNode.path("visit_time").asText());
                    stop.setAddress(stopNode.path("address").asText());
                    stop.setImageKeyword(stopNode.path("image_keyword").asText());
                    stop.setTripDay(tripDay); // קישור חזרה ליום

                    routeStops.add(stop);
                }
                tripDay.setStops(routeStops);
                tripDays.add(tripDay);
            }
            trip.setDays(tripDays);

            // 5. שמירה ב-DB! בזכות ה-Cascade, זה שומר גם את הימים והתחנות
            Trip savedTrip = tripService.saveTrip(trip);

            return ResponseEntity.ok(savedTrip);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to save trip: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        Trip trip = tripService.getTripById(id);
        
        if (trip != null) {
            return ResponseEntity.ok(trip);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        try {
            tripService.deleteTrip(id);
            return ResponseEntity.ok().build(); // מחזיר סטטוס 200 (הצלחה) בלי תוכן
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to delete trip\"}");
        }
    }
}