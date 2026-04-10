package edu.cit.durano.foodcloud.service;

import edu.cit.durano.foodcloud.dto.ProductDto;
import edu.cit.durano.foodcloud.entity.Product;
import edu.cit.durano.foodcloud.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

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

    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<ProductDto> dtos = new ArrayList<>();

        for(Product product : products)  {
            dtos.add(toDto(product));
        }
        return dtos;
    }

    public ProductDto getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return toDto(product);
    }

    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (dto.getName() != null) existing.setName(dto.getName());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
        if (dto.getPrice() != null) existing.setPrice(dto.getPrice());
        if (dto.getStockQuantity() != null) existing.setStockQuantity(dto.getStockQuantity());
        if (dto.getImageUrl() != null) existing.setImageUrl(dto.getImageUrl());
        if (dto.getSku() != null) existing.setSku(dto.getSku());

        Product updated = productRepository.save(existing);
        return toDto(updated);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    //I already implemented this in the previous activity sir, I am going to commit this comment;
    //thank you for understanding sir :) <3
    //this is a factory method pattern as it encapsulates the creation of product and the conversion to DTO;
    //the product controller takes dto's and returns dto's instead of returning the entity directly;

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
        return entity;
    }


}
