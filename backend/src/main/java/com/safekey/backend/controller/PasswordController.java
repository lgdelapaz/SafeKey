package com.safekey.backend.controller;

import com.safekey.backend.model.Password;
import com.safekey.backend.repository.PasswordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {

    @Autowired
    private PasswordRepository passwordRepository;

    // Get all passwords
    @GetMapping("/all")
    public List<Password> getAllPasswords() {
        return passwordRepository.findAll();
    }

    // Get passwords by user ID
    @GetMapping("/user/{userId}")
    public List<Password> getPasswordsByUser(@PathVariable Long userId) {
        return passwordRepository.findByUserUserId(userId);
    }

    // Save new password
    @PostMapping("/save")
    public String savePassword(@RequestBody Password password) {
        passwordRepository.save(password);
        return " Password saved successfully";
    }

    // Update existing password
    @PutMapping("/update/{id}")
    public String updatePassword(@PathVariable Long id, @RequestBody Password password) {
        Password existing = passwordRepository.findById(id).orElse(null);
        if (existing == null) {
            return " Password not found";
        }

        existing.setPlatformName(password.getPlatformName());
        existing.setUsername(password.getUsername());
        existing.setPasswordValue(password.getPasswordValue());
        existing.setUrl(password.getUrl());
        existing.setCreatedAt(password.getCreatedAt());

        passwordRepository.save(existing);
        return " Password updated successfully";
    }

    // Delete password
    @DeleteMapping("/delete/{id}")
    public String deletePassword(@PathVariable Long id) {
        Password existing = passwordRepository.findById(id).orElse(null);
        if (existing == null) {
            return " Password not found";
        }
        passwordRepository.delete(existing);
        return "🗑 Deleted password with ID: " + id;
    }
}
