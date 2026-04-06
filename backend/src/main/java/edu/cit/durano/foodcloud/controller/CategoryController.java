package edu.cit.durano.foodcloud.controller;

import edu.cit.durano.foodcloud.service.CategoryService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }
}
