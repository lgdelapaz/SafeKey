package com.safekey.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "passwords")
public class Password {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long passwordId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 🔥 ADD THIS
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String platformName; // Example: "Facebook", "Gmail"

    @Column(nullable = false)
    private String username; // The account username/email

    @Column(nullable = false)
    private String passwordValue; // The encrypted password

    @Column(nullable = true)
    private String url; // Optional: link to the platform

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // === Getters & Setters ===
    public Long getPasswordId() { return passwordId; }
    public void setPasswordId(Long passwordId) { this.passwordId = passwordId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getPlatformName() { return platformName; }
    public void setPlatformName(String platformName) { this.platformName = platformName; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordValue() { return passwordValue; }
    public void setPasswordValue(String passwordValue) { this.passwordValue = passwordValue; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
