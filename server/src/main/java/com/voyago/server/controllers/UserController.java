package com.voyago.server.controllers;

import com.voyago.server.models.User;
import com.voyago.server.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

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

}