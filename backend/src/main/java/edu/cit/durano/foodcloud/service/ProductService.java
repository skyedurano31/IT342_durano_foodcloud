package edu.cit.durano.foodcloud.service;

import edu.cit.durano.foodcloud.dto.ProductDto;
import edu.cit.durano.foodcloud.entity.Product;
import edu.cit.durano.foodcloud.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductDto createProduct(ProductDto dto) {
        Product product = toEntity(dto);
        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    private ProductDto toDto(Product entity) {
        ProductDto dto = new ProductDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setSku(entity.getSku());
        dto.setStockQuantity(entity.getStockQuantity());
        dto.setImageUrl(entity.getImageUrl());

        return dto;
    }

    private Product toEntity(ProductDto dto) {
        Product entity = new Product();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setSku(dto.getSku());
        entity.setStockQuantity(dto.getStockQuantity());
        entity.setImageUrl(dto.getImageUrl());
        // Note: category is set separately (need to fetch from DB)
        return entity;
    }


}
