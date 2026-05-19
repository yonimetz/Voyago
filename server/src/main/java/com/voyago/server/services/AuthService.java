package com.voyago.server.services;

import com.voyago.server.dto.LoginRequest;
import com.voyago.server.dto.RegisterRequest;
import com.voyago.server.models.User;
import com.voyago.server.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {  //יצירת משתמש
        if (userRepository.findByEmail(request.getEmail()) != null) {  //בדיקה אם קיים מייל במערכת
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));  //הצפנת סיסמה למחרוזת
        
        return userRepository.save(user);  //שמירת המשתמש
    }

    public User authenticate(LoginRequest request) {  //בדיקה אם משתמש קיים
        User user = userRepository.findByUsername(request.getUsername());

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        return user;
    }
}