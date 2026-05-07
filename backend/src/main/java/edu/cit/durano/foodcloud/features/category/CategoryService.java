package edu.cit.durano.foodcloud.features.category;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

   public List<CategoryDto> getAllCategories() {
        List<Category> categories= categoryRepository.findAll();
        List<CategoryDto> categoryDtos = new ArrayList<>();

        for(Category category : categories) {
            categoryDtos.add(toDto(category));
        }
        return categoryDtos;
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
