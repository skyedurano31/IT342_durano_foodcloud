package edu.cit.durano.foodcloud.service;

import edu.cit.durano.foodcloud.dto.ProductDto;
import edu.cit.durano.foodcloud.entity.Category;
import edu.cit.durano.foodcloud.entity.Product;
import edu.cit.durano.foodcloud.repository.CategoryRepository;
import edu.cit.durano.foodcloud.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository; // Add this

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    // NEW: Create product with image upload
    public ProductDto createProductWithImage(ProductDto dto, MultipartFile imageFile) throws IOException {
        String imageUrl = null;

        // Save image if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = saveImage(imageFile);
            dto.setImageUrl(imageUrl);
        }

        Product product = toEntity(dto);

        // Set category if categoryId is provided
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));
            product.setCategory(category);
        }

        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    // NEW: Update product with optional image upload
    public ProductDto updateProductWithImage(Long id, ProductDto dto, MultipartFile imageFile) throws IOException {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Update fields
        if (dto.getName() != null) existing.setName(dto.getName());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
        if (dto.getPrice() != null) existing.setPrice(dto.getPrice());
        if (dto.getStockQuantity() != null) existing.setStockQuantity(dto.getStockQuantity());
        if (dto.getSku() != null) existing.setSku(dto.getSku());

        // Handle image update
        if (imageFile != null && !imageFile.isEmpty()) {
            // Optional: Delete old image file
            deleteOldImage(existing.getImageUrl());

            // Save new image
            String imageUrl = saveImage(imageFile);
            existing.setImageUrl(imageUrl);
        }

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));
            existing.setCategory(category);
        }

        Product updated = productRepository.save(existing);
        return toDto(updated);
    }

    // Keep your existing methods
    public ProductDto createProduct(ProductDto dto) {
        Product product = toEntity(dto);
        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<ProductDto> dtos = new ArrayList<>();
        for(Product product : products) {
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
        // Optional: Delete image file before deleting product
        Product product = productRepository.findById(id).orElse(null);
        if (product != null && product.getImageUrl() != null) {
            deleteOldImage(product.getImageUrl());
        }
        productRepository.deleteById(id);
    }

    // Helper method to save image file
    private String saveImage(MultipartFile imageFile) throws IOException {
        // Validate file type
        if (imageFile.getContentType() == null || !imageFile.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Create upload directory
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        // Generate unique filename
        String originalFilename = imageFile.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path targetPath = uploadPath.resolve(uniqueFilename);
        Files.copy(imageFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Return URL path (will be served by WebConfig)
        return "/images/" + uniqueFilename;
    }

    // Helper method to delete old image
    private void deleteOldImage(String imageUrl) {
        if (imageUrl != null && imageUrl.startsWith("/images/")) {
            try {
                String filename = imageUrl.substring(8); // Remove "/images/"
                Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
                Path imagePath = uploadPath.resolve(filename);
                Files.deleteIfExists(imagePath);
            } catch (IOException e) {
                // Log error but don't throw - image deletion shouldn't break the operation
                System.err.println("Failed to delete old image: " + e.getMessage());
            }
        }
    }

    // Your existing toDto and toEntity methods
    private ProductDto toDto(Product entity) {
        ProductDto dto = new ProductDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setSku(entity.getSku());
        dto.setStockQuantity(entity.getStockQuantity());
        dto.setImageUrl(entity.getImageUrl());

        if (entity.getCategory() != null) {
            dto.setCategoryId(entity.getCategory().getId());
            dto.setCategoryName(entity.getCategory().getName());
        }

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