package edu.cit.durano.foodcloud.service;

import edu.cit.durano.foodcloud.dto.CartDto;
import edu.cit.durano.foodcloud.dto.CartItemDto;
import edu.cit.durano.foodcloud.entity.Cart;
import edu.cit.durano.foodcloud.entity.CartItem;
import edu.cit.durano.foodcloud.entity.Product;
import edu.cit.durano.foodcloud.entity.User;
import edu.cit.durano.foodcloud.repository.CartItemRepository;
import edu.cit.durano.foodcloud.repository.CartRepository;
import edu.cit.durano.foodcloud.repository.ProductRepository;
import edu.cit.durano.foodcloud.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });
    }

    public CartDto addToCart(Long userId, Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if product already in cart
        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem(cart, product, quantity);
            cart.addCartItem(newItem);
            cartItemRepository.save(newItem);
        }

        cart.calculateTotal();
        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }

    public CartDto updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }

        Cart cart = getOrCreateCart(userId);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }

        if (quantity == 0) {
            cart.removeCartItem(cartItem);
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        cart.calculateTotal();
        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }

    public CartDto removeFromCart(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }

        cart.removeCartItem(cartItem);
        cartItemRepository.delete(cartItem);

        cart.calculateTotal();
        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }

    public CartDto getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return convertToDto(cart);
    }

    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    public Integer getCartItemCount(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return cart.getCartItems().size();
    }

    private CartDto convertToDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        dto.setTotalAmount(cart.getTotalAmount());

        dto.setItems(cart.getCartItems().stream()
                .map(this::convertToCartItemDto)
                .collect(Collectors.toList()));

        return dto;
    }

    private CartItemDto convertToCartItemDto(CartItem item) {
        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImage(item.getProduct().getImageUrl());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getProduct().getPrice());
        dto.setSubtotal(item.getItemTotal());
        return dto;
    }
}
