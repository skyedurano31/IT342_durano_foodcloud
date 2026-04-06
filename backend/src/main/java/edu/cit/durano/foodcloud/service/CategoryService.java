package edu.cit.durano.foodcloud.service;

import edu.cit.durano.foodcloud.dto.CategoryDto;
import edu.cit.durano.foodcloud.entity.Category;
import edu.cit.durano.foodcloud.repository.CategoryRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryDto createCategory(CategoryDto dto) {
        Category category = toEntity(dto);
        return toDto(categoryRepository.save(category));
    }

    private Category toEntity(CategoryDto dto) {
        Category category = new Category();
        category.setDescription(dto.getDescription());
        category.setName(dto.getName());
        return category;
    }
    private CategoryDto toDto(Category category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        categoryDto.setDescription(category.getDescription());
        return categoryDto;
    }
}
