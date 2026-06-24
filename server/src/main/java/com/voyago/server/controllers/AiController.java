package com.voyago.server.controllers;

import com.voyago.server.services.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // ודא שהפורט תואם לריאקט שלך
public class AiController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<?> chatWithAi(@RequestBody Map<String, String> payload) {
        try {
            String prompt = payload.get("prompt");
            if (prompt == null || prompt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
            }
            
            String reply = geminiService.generateChatReply(prompt);
            
            // מחזיר אובייקט JSON עם מפתח text כפי שה-React מצפה לקבל
            return ResponseEntity.ok(Map.of("text", reply));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}