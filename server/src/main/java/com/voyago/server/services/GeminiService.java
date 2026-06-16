package com.voyago.server.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // הפונקציה הראשית ליצירת טיול שלם
    public String generateTripPlan(String destination, String startDate, String endDate, String style, String aiPreferences, String language) {
        String targetLanguage = (language != null && language.equals("he")) ? "Hebrew" : "English";

        String prompt = "Act as a professional travel planner. Generate a detailed trip itinerary for " + destination + 
                        " from " + startDate + " to " + endDate + ". Trip style/preference: " + style + ". ";
                        
        if (aiPreferences != null && !aiPreferences.trim().isEmpty()) {
            prompt += "CRITICAL USER PREFERENCES: " + aiPreferences + ". You MUST adhere to these rules strictly when planning the itinerary. ";
        }

        prompt += "LANGUAGE INSTRUCTION: You must write all the generated content (descriptions, stop names, destination name) in " + targetLanguage + ". " +
                  "HOWEVER, the JSON keys MUST remain exactly in English to match our schema. ";

        prompt += "Output Requirements: Return ONLY a valid JSON object. No conversational text. " +
                  "The JSON must match this structureto fit our MySQL schema: " +
                  "{ \"destination\": \"Name of destination strictly translated to " + targetLanguage + "\", " +
                  "\"image_keyword\": \"Name of the destination strictly in English (for image search)\", " +
                  "\"days\": [ { \"day_number\": 1, \"date\": \"YYYY-MM-DD\", \"stops\": [ { " +
                  "\"location_name\": \"string\", " +
                  "\"visit_time\": \"Short summary of the activity (MAX 100 characters)\", " +
                  "\"address\": \"string\", " +
                  "\"image_keyword\": \"Strictly English search term for this specific stop\" } ] } ] }";

        // עכשיו פשוט קוראים לפונקציית העזר שלנו!
        return callGeminiApi(prompt);
    }

    // הפונקציה החדשה להחלפת תחנה בודדת
    public String generateAlternativeStop(String destination, String currentStopName, String currentStopDesc, String userPrompt) {
        String reason = (userPrompt != null && !userPrompt.trim().isEmpty()) 
                ? userPrompt 
                : "No specific reason, just suggest a different type of attraction or experience.";

        String prompt = String.format(
            "You are an expert travel planner. The user is planning a trip to %s. " +
            "They currently have a stop planned at '%s' (Description: '%s'). They want to change it. " +
            "User's reason for changing: '%s'. " +
            "CRITICAL INSTRUCTION: If the user's reason explicitly asks for a different TYPE of activity (e.g., 'no food', 'want a museum', 'tired of walking'), follow their request immediately. " +
            "However, if their reason is general (like 'too expensive', 'boring', or left empty), try to maintain the original PURPOSE of the stop (e.g., replace a lunch spot with another lunch spot, or a park with another outdoor area). " +
            "Return ONLY a valid JSON object (no markdown, no code blocks) with exactly these keys: " +
            "\"location_name\" (string), \"visit_time\" (string - short description of the activity), \"address\" (string), \"image_keyword\" (string - English term for unsplash).",
            destination, currentStopName, currentStopDesc, reason
        );

        return callGeminiApi(prompt); 
    }

    // --- פונקציית העזר הפרטית שמדברת בפועל עם השרתים של גוגל ---
    private String callGeminiApi(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + apiKey;
        
        String safePrompt = prompt.replace("\"", "\\\"").replace("\n", " ");
        String requestBody = "{\n" +
                "  \"contents\": [{\n" +
                "    \"parts\":[{\"text\": \"" + safePrompt + "\"}]\n" +
                "  }]\n" +
                "}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            String rawResponse = restTemplate.postForObject(url, entity, String.class);
            JsonNode rootNode = objectMapper.readTree(rawResponse);
            String extractedJson = rootNode.path("candidates")
                                           .get(0)
                                           .path("content")
                                           .path("parts")
                                           .get(0)
                                           .path("text")
                                           .asText();

            return extractedJson.replace("```json", "").replace("```", "").trim();

        } catch (Exception e) {
            throw new RuntimeException("Failed to communicate with Gemini API: " + e.getMessage());
        }
    }
}