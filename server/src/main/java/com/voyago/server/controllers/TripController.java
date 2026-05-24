package com.voyago.server.controllers;

import com.voyago.server.dto.TripGenerationRequest;
import com.voyago.server.models.Trip;
import com.voyago.server.services.GeminiService;
import com.voyago.server.services.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;
    private final GeminiService geminiService;

    public TripController(TripService tripService, GeminiService geminiService) {
        this.tripService = tripService;
        this.geminiService = geminiService;
    }

    // שליפת כל הטיולים של משתמש מסוים
    @GetMapping("/user/{userId}")
    public List<Trip> getTripsByUserId(@PathVariable Long userId) {
        return tripService.getTripsByUserId(userId);
    }

    // פנייה ל-AI ליצירת מסלול
    @PostMapping("/generate")
    public ResponseEntity<?> generateTripWithAI(@RequestBody TripGenerationRequest request) {
        try {
            String aiResponseJson = geminiService.generateTripPlan( // קריאה לשירות של גוגל
                    request.getDestination(),
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getStyle()
            );
            
            // בשלב זה אנחנו רק מחזירים את התשובה כדי לוודא שהאינטגרציה עובדת!
            return ResponseEntity.ok().contentType(org.springframework.http.MediaType.APPLICATION_JSON).body(aiResponseJson);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"AI Generation failed: " + e.getMessage() + "\"}");
        }
    }
}