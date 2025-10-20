package com.safekey.backend.repository;

import com.safekey.backend.model.Password;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordRepository extends JpaRepository<Password, Long> {
    List<Password> findByUserUserId(Long userId);
}
