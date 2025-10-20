package com.safekey.backend.controller;


import com.safekey.backend.model.User;
import com.safekey.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    //test
    @GetMapping("/")
    public String getPage(){
        return "Hi Lance";
    }
    //gets the users
    @GetMapping(value = "/users")
    public List<User> getUser(){
        return userRepository.findAll();
    }
    //create user
    @PostMapping(value = "/save")
    public String saveUser(@RequestBody User user) {
        userRepository.save(user);
        return "saved";
    }

    // Update user
    @PutMapping(value = "/update/{id}")
    public String updateUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = userRepository.findById(id).orElse(null);
        if (updatedUser == null) {
            return "User not found";
        }
        updatedUser.setFirstName(user.getFirstName());
        updatedUser.setLastName(user.getLastName());
        updatedUser.setPinCode(user.getPinCode());
        updatedUser.setFingerprintData(user.getFingerprintData());
        updatedUser.setCreatedAt(user.getCreatedAt());
        userRepository.save(updatedUser);
        return "User updated successfully";
    }

    //delete user
    @DeleteMapping(value = "/delete/{id}")
    public String deleteUser(@PathVariable long id) {
        User deleteUser = userRepository.findById(id).get();
        userRepository.delete(deleteUser);
        return "Delete user with the id: "+id;

    }




}
