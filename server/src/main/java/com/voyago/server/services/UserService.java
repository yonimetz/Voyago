package com.voyago.server.services;

import com.voyago.server.dto.UserUpdateDTO;
import com.voyago.server.models.User;
import com.voyago.server.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // שמירת משתמש חדש
    public User saveUser(User user) {
        // הערה: בדרך כלל שומרים דרך AuthService כדי להצפין סיסמה, אבל נשאיר את זה כאן אם יש לך שימוש לזה
        return userRepository.save(user);
    }

    // עדכון פרופיל
    @Transactional
    public User updateUser(Long id, UserUpdateDTO request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setAiPreferences(request.getAiPreferences());
        
        return userRepository.save(user);
    }

    // עדכון סיסמה
    @Transactional
    public void updatePassword(Long id, String oldPassword, String newPassword) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // בדיקה שהסיסמה הישנה תואמת
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password does not match");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        
        userRepository.save(user);
    }

    // מחיקת משתמש
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}