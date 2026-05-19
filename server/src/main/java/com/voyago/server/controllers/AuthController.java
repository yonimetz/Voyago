package com.voyago.server.controllers;

import com.voyago.server.dto.LoginRequest;
import com.voyago.server.dto.RegisterRequest;
import com.voyago.server.models.User;
import com.voyago.server.services.AuthService;
import com.voyago.server.utils.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok().body("User registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request, jakarta.servlet.http.HttpServletResponse response) {
        try {
            User user = authService.authenticate(request);
            
            String token = jwtUtil.generateToken(user.getEmail());

            // HttpOnly Cookie יצירת
            jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("jwt", token);
            cookie.setHttpOnly(true); // חוסם גישת JavaScript לעוגייה ומגן מפני XSS
            cookie.setSecure(false);  // ישונה ל-true כאשר נעבור ל-HTTPS בסביבת פרודקשן
            cookie.setPath("/");      // זמין לכל נתיבי האפליקציה
            cookie.setMaxAge(24 * 60 * 60); // תוקף ל-24 שעות

            response.addCookie(cookie);

            return ResponseEntity.ok().body("{\"id\":" + user.getId() + ", \"username\":\"" + user.getUsername() + "\", \"email\":\"" + user.getEmail() + "\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}