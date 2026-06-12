package com.voyago.server.controllers;

import com.voyago.server.models.User;
import com.voyago.server.repositories.UserRepository;
import com.voyago.server.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @DeleteMapping("/{id}")
public void deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
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
}