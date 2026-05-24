package com.voyago.server.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public GeminiService() {
        this.restTemplate = new RestTemplate();
    }

    public String generateTripPlan(String destination, String startDate, String endDate, String style) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        // הפרומפט מתוך דוח התכנון, בתוספת הפרמטרים שקיבלנו מהמשתמש
        String prompt = "Act as a professional travel planner. Generate a detailed trip itinerary for " + destination + 
                        " from " + startDate + " to " + endDate + ". Trip style/preference: " + style + ". " +
                        "Output Requirements: Return ONLY a valid JSON object. No conversational text. " +
                        "The JSON must match this structure to fit our MySQL schema: " +
                        "{ \"destination\": \"string\", \"days\": [ { \"day_number\": 1, \"date\": \"YYYY-MM-DD\", \"stops\": [ { \"stop_name\": \"string\", \"description\": \"string\", \"location_coords\": \"latitude,longitude\" } ] } ] }";

        // עטיפת הפרומפט בתוך מבנה ה-JSON ש-Gemini דורש לקבל
        String requestBody = "{\n" +
                "  \"contents\": [{\n" +
                "    \"parts\":[{\"text\": \"" + prompt.replace("\"", "\\\"") + "\"}]\n" +
                "  }]\n" +
                "}";

        // הגדרת סוג התוכן כ-JSON
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {  //ניסיון, שליחת בקשה וקבלת תגובה
            return restTemplate.postForObject(url, entity, String.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to communicate with Gemini API: " + e.getMessage());
        }
    }
}