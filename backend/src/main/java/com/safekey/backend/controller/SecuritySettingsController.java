package com.safekey.backend.controller;

import com.safekey.backend.model.SecuritySettings;
import com.safekey.backend.repository.SecuritySettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security")
public class SecuritySettingsController {

    @Autowired
    private SecuritySettingsRepository repository;

    @GetMapping("/{userId}")
    public SecuritySettings getSecuritySettings(@PathVariable Long userId) {
        return repository.findByUserUserId(userId);
    }

    @PostMapping("/save")
    public String saveSecuritySettings(@RequestBody SecuritySettings settings) {
        repository.save(settings);
        return " Security settings saved";
    }

    @PutMapping("/update/{id}")
    public String updateSecuritySettings(@PathVariable Long id, @RequestBody SecuritySettings settings) {
        SecuritySettings existing = repository.findById(id).orElse(null);
        if (existing == null) return " Settings not found";

        existing.setBiometricEnabled(settings.isBiometricEnabled());
        existing.setOtpEnabled(settings.isOtpEnabled());
        existing.setPreferredOtpMethod(settings.getPreferredOtpMethod());
        existing.setBackupEmail(settings.getBackupEmail());
        existing.setBackupPhone(settings.getBackupPhone());

        repository.save(existing);
        return " Security settings updated";
    }
}
