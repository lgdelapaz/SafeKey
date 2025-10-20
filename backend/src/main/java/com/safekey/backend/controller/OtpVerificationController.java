package com.safekey.backend.controller;

import com.safekey.backend.model.OtpVerification;
import com.safekey.backend.repository.OtpVerificationRepository;
import com.safekey.backend.repository.UserRepository;
import com.safekey.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/otp")
public class OtpVerificationController {

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private UserRepository userRepository;

    // 🔹 Generate new OTP for a user
    @PostMapping("/generate/{userId}")
    public String generateOtp(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return " User not found";
        }

        User user = userOpt.get();

        // Generate a 6-digit random OTP
        String otpCode = String.format("%06d", new Random().nextInt(999999));

        OtpVerification otp = new OtpVerification();
        otp.setUser(user);
        otp.setOtpCode(otpCode);
        otp.setGeneratedAt(LocalDateTime.now());
        otp.setVerified(false);

        otpRepository.save(otp);
        return " OTP generated successfully: " + otpCode;
    }

    // 🔹 Verify OTP
    @PostMapping("/verify/{userId}")
    public String verifyOtp(@PathVariable Long userId, @RequestParam String otpCode) {
        Optional<OtpVerification> latestOtpOpt = otpRepository.findTopByUserUserIdOrderByGeneratedAtDesc(userId);

        if (latestOtpOpt.isEmpty()) {
            return " No OTP found for this user";
        }

        OtpVerification latestOtp = latestOtpOpt.get();

        // Check expiry: valid for 5 minutes
        Duration duration = Duration.between(latestOtp.getGeneratedAt(), LocalDateTime.now());
        if (duration.toMinutes() > 5) {
            return " OTP expired";
        }

        // Validate code
        if (!latestOtp.getOtpCode().equals(otpCode)) {
            return " Invalid OTP code";
        }

        // Mark verified
        latestOtp.setVerified(true);
        otpRepository.save(latestOtp);

        return " OTP verified successfully";
    }

    // 🔹 Get all OTP entries
    @GetMapping("/all")
    public java.util.List<OtpVerification> getAllOtps() {
        return otpRepository.findAll();
    }

    // 🔹 Delete an OTP record
    @DeleteMapping("/delete/{id}")
    public String deleteOtp(@PathVariable Long id) {
        Optional<OtpVerification> otp = otpRepository.findById(id);
        if (otp.isEmpty()) return " OTP record not found";
        otpRepository.delete(otp.get());
        return "🗑 Deleted OTP record with ID: " + id;
    }
}
