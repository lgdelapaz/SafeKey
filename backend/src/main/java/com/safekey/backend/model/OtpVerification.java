package com.safekey.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verification")
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long otpId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String otpCode;

    @Column(nullable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();

    private boolean verified = false;

    // === Getters and Setters ===
    public Long getOtpId() { return otpId; }
    public void setOtpId(Long otpId) { this.otpId = otpId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
