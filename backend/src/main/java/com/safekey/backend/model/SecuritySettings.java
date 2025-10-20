package com.safekey.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "security_settings")
public class SecuritySettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long settingId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private boolean biometricEnabled;
    private boolean otpEnabled;
    private String preferredOtpMethod; // "SMS" or "Email"
    private String backupEmail;
    private String backupPhone;

    // Getters & Setters
    public Long getSettingId() { return settingId; }
    public void setSettingId(Long settingId) { this.settingId = settingId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public boolean isBiometricEnabled() { return biometricEnabled; }
    public void setBiometricEnabled(boolean biometricEnabled) { this.biometricEnabled = biometricEnabled; }

    public boolean isOtpEnabled() { return otpEnabled; }
    public void setOtpEnabled(boolean otpEnabled) { this.otpEnabled = otpEnabled; }

    public String getPreferredOtpMethod() { return preferredOtpMethod; }
    public void setPreferredOtpMethod(String preferredOtpMethod) { this.preferredOtpMethod = preferredOtpMethod; }

    public String getBackupEmail() { return backupEmail; }
    public void setBackupEmail(String backupEmail) { this.backupEmail = backupEmail; }

    public String getBackupPhone() { return backupPhone; }
    public void setBackupPhone(String backupPhone) { this.backupPhone = backupPhone; }
}
