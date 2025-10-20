package com.safekey.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String action; // Example: "CREATE_PASSWORD", "UPDATE_CATEGORY", "DELETE_USER"

    @Column(nullable = false)
    private String target; // Example: "Password", "Category", "User"

    @Column(nullable = true)
    private String details; // Optional description of the action

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    // === Getters & Setters ===
    public Long getLogId() { return logId; }
    public void setLogId(Long logId) { this.logId = logId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
