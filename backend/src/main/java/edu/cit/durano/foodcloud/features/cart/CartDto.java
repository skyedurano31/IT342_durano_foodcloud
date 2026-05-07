package edu.cit.durano.foodcloud.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartDto {

    private Long id;
    private Long userId;
    private List<CartItemDto> items = new ArrayList<>();
    private BigDecimal totalAmount = BigDecimal.ZERO;
    private Integer itemCount = 0;

    // Constructors
    public CartDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) {
        this.items = items;
        this.itemCount = items.size();
    }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public Integer getItemCount() { return itemCount; }
    public void setItemCount(Integer itemCount) { this.itemCount = itemCount; }
}