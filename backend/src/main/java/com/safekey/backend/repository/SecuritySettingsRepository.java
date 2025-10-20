package com.safekey.backend.repository;

import com.safekey.backend.model.SecuritySettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecuritySettingsRepository extends JpaRepository<SecuritySettings, Long> {
    SecuritySettings findByUserUserId(Long userId);
}
