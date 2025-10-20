package com.safekey.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(nullable = false, unique = true)
    private String categoryName;

    // A category may belong to a user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // One category can contain many passwords
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Password> passwords;

    // Getters & Setters
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Password> getPasswords() { return passwords; }
    public void setPasswords(List<Password> passwords) { this.passwords = passwords; }
}
