package com.voyago.server.services;

import com.voyago.server.models.RouteStop;
import com.voyago.server.repositories.RouteStopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;
import java.util.Map;

@Service
public class RouteStopService {
    @Autowired
    private RouteStopRepository routeStopRepository;

    public RouteStop saveStop(RouteStop stop) {
        return routeStopRepository.save(stop);
    }

    public List<RouteStop> getStopsByDayId(Long dayId) {
        return routeStopRepository.findByTripDayId(dayId);
    }

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private com.voyago.server.repositories.TripRepository tripRepository;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public RouteStop updatePersonalNote(Long stopId, String note) {
        Optional<RouteStop> stopOptional = routeStopRepository.findById(stopId);
        
        if (stopOptional.isPresent()) {
            RouteStop stop = stopOptional.get();
            stop.setPersonalNote(note);
            return routeStopRepository.save(stop);
        }
        
        return null;
    }

    public RouteStop regenerateStop(Long stopId, Long tripId, String userPrompt) {
        //מציאת התחנה
        RouteStop stop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Stop not found"));
        com.voyago.server.models.Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        // שליחה לAI עם סיבה
        String aiResponse = geminiService.generateAlternativeStop(trip.getDestination(), stop.getLocationName(), stop.getVisitTime(), userPrompt);

        try {
            // פענוח
            String cleanJson = aiResponse.replace("```json", "").replace("```", "").trim();
            com.fasterxml.jackson.databind.JsonNode jsonNode = objectMapper.readTree(cleanJson);

            // עדכון
            stop.setLocationName(jsonNode.path("location_name").asText("Alternative Stop"));
            stop.setVisitTime(jsonNode.path("visit_time").asText("Enjoy your alternative activity."));
            stop.setAddress(jsonNode.path("address").asText(""));
            stop.setImageKeyword(jsonNode.path("image_keyword").asText("travel"));
            
            // איפוס פתק אישי
            stop.setPersonalNote(null);

            // 5. שמירה במסד הנתונים
            return routeStopRepository.save(stop);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response for alternative stop", e);
        }
    }

    public RouteStop restoreStop(Long stopId, Map<String, String> originalData) {
        RouteStop stop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Stop not found"));
        
        stop.setLocationName(originalData.get("locationName"));
        stop.setVisitTime(originalData.get("visitTime"));
        stop.setAddress(originalData.get("address"));
        stop.setImageKeyword(originalData.get("imageKeyword"));
        
        return routeStopRepository.save(stop);
    }

    public RouteStop updateDocument(Long stopId, String documentUrl, String documentName) {
        RouteStop stop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Stop not found"));
        
        stop.setAttachedDocumentUrl(documentUrl);
        stop.setAttachedDocumentName(documentName);
        
        return routeStopRepository.save(stop);
    }
}