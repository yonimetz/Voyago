package com.voyago.server.controllers;

import com.voyago.server.dto.PasswordUpdateDTO;
import com.voyago.server.dto.UserUpdateDTO;
import com.voyago.server.models.User;
import com.voyago.server.repositories.UserRepository;
import com.voyago.server.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // שליפת כל המשתמשים
    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    // יצירת משתמש חדש
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/{id}/preferences")
        public ResponseEntity<?> updatePreferences(@PathVariable Long id, @RequestBody Map<String, String> request) {
            try {
                // חיפוש המשתמש במסד הנתונים
                User user = userRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                // עדכון השדה החדש ושמירה
                user.setAiPreferences(request.get("aiPreferences"));
                User updatedUser = userRepository.save(user);

                return ResponseEntity.ok(updatedUser);
                
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("{\"error\": \"Failed to update preferences\"}");
            }
        }
    // 1. עדכון פרופיל מלא
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody UserUpdateDTO request) {
        try {
            User updatedUser = userService.updateUser(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating user: " + e.getMessage());
        }
    }

    // 2. עדכון סיסמה
    @PutMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody PasswordUpdateDTO request) {
        try {
            userService.updatePassword(id, request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok().body("{\"message\": \"Password updated successfully\"}");
        } catch (IllegalArgumentException e) {
            // סיסמה ישנה שגויה
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Invalid old password\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"Error updating password\"}");
        }
    }

    // 3. מחיקת חשבון
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().body("{\"message\": \"Account deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"Error deleting account\"}");
        }
    }
}