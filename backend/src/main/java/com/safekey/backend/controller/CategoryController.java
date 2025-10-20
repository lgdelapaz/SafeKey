package com.safekey.backend.controller;

import com.safekey.backend.model.Category;
import com.safekey.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/all")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Category> getCategoriesByUser(@PathVariable Long userId) {
        return categoryRepository.findByUserUserId(userId);
    }

    @PostMapping("/save")
    public String saveCategory(@RequestBody Category category) {
        categoryRepository.save(category);
        return " Category saved successfully";
    }

    @PutMapping("/update/{id}")
    public String updateCategory(@PathVariable Long id, @RequestBody Category category) {
        Category existing = categoryRepository.findById(id).orElse(null);
        if (existing == null) return " Category not found";

        existing.setCategoryName(category.getCategoryName());
        categoryRepository.save(existing);
        return " Category updated successfully";
    }

    @DeleteMapping("/delete/{id}")
    public String deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) return " Category not found";

        categoryRepository.delete(category);
        return "🗑 Deleted category with ID: " + id;
    }
}
