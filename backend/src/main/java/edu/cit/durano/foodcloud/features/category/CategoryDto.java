package edu.cit.durano.foodcloud.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDto {

    private Long id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    // Constructors
    public CategoryDto() {}

    public CategoryDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}