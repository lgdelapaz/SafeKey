package com.safekey.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "/users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId; // Should be Long, not String for auto-increment IDs

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    // PIN as 6-digit or 4-digit numeric code
    @Column(nullable = false)
    private Integer pinCode;

    // Encrypted or encoded fingerprint data (string or base64)
    @Lob
    @Column(nullable = true)
    private String fingerprintData;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ====== Getters & Setters ======
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Integer getPinCode() {
        return pinCode;
    }
    public void setPinCode(Integer pinCode) {
        this.pinCode = pinCode;
    }

    public String getFingerprintData() {
        return fingerprintData;
    }
    public void setFingerprintData(String fingerprintData) {
        this.fingerprintData = fingerprintData;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}