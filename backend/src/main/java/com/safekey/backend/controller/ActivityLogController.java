package com.safekey.backend.controller;

import com.safekey.backend.model.ActivityLog;
import com.safekey.backend.model.User;
import com.safekey.backend.repository.ActivityLogRepository;
import com.safekey.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/logs")
public class ActivityLogController {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private UserRepository userRepository;

    // 🔹 Get all logs
    @GetMapping("/all")
    public List<ActivityLog> getAllLogs() {
        return activityLogRepository.findAll();
    }

    // 🔹 Get logs for a specific user
    @GetMapping("/user/{userId}")
    public List<ActivityLog> getLogsByUser(@PathVariable Long userId) {
        return activityLogRepository.findByUserUserId(userId);
    }

    // 🔹 Create a new log (used by other controllers when actions happen)
    @PostMapping("/save")
    public String saveLog(@RequestBody ActivityLog log) {
        activityLogRepository.save(log);
        return " Activity log saved successfully";
    }

    // 🔹 Automatically log an action (helper for testing)
    @PostMapping("/auto/{userId}")
    public String logAction(@PathVariable Long userId,
                            @RequestParam String action,
                            @RequestParam String target,
                            @RequestParam(required = false) String details) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return " User not found";

        ActivityLog log = new ActivityLog();
        log.setUser(userOpt.get());
        log.setAction(action);
        log.setTarget(target);
        log.setDetails(details);

        activityLogRepository.save(log);
        return " Logged: " + action + " on " + target;
    }

    // 🔹 Delete a specific log entry
    @DeleteMapping("/delete/{id}")
    public String deleteLog(@PathVariable Long id) {
        Optional<ActivityLog> log = activityLogRepository.findById(id);
        if (log.isEmpty()) return " Log not found";
        activityLogRepository.delete(log.get());
        return "🗑 Deleted log with ID: " + id;
    }

    // 🔹 Clear all logs (optional for admin use)
    @DeleteMapping("/clear")
    public String clearAllLogs() {
        activityLogRepository.deleteAll();
        return " All logs cleared";
    }
}
