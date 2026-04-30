package com.voyago.server.services;

import com.voyago.server.models.User;
import com.voyago.server.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // פונקציה להחזרת כל המשתמשים
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // פונקציה לשמירת משתמש חדש
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
    userRepository.deleteById(id);
}

}