package edu.cit.durano.foodcloud.controller;

import edu.cit.durano.foodcloud.dto.CartDto;
import edu.cit.durano.foodcloud.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartDto> getCart(@RequestParam Long userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDto> addToCart(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());

        return ResponseEntity.ok(cartService.addToCart(userId, productId, quantity));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartDto> updateQuantity(@RequestParam Long userId,
                                                  @PathVariable Long cartItemId,
                                                  @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(userId, cartItemId, quantity));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartDto> removeFromCart(@RequestParam Long userId,
                                                  @PathVariable Long cartItemId) {
        return ResponseEntity.ok(cartService.removeFromCart(userId, cartItemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getCartCount(@RequestParam Long userId) {
        return ResponseEntity.ok(cartService.getCartItemCount(userId));
    }
}
