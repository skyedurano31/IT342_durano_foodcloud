package edu.cit.durano.foodcloud.controller;

import edu.cit.durano.foodcloud.dto.OrderDto;
import edu.cit.durano.foodcloud.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderDto> checkout(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String building = request.get("building").toString();
        String roomNumber = request.get("roomNumber").toString();
        String deliveryInstructions = request.getOrDefault("deliveryInstructions", "").toString();
        String phoneNumber = request.get("phoneNumber").toString();

        OrderDto order = orderService.createOrderFromCart(userId, building, roomNumber,
                deliveryInstructions, phoneNumber);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrder(orderId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDto>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderDto> updateStatus(@PathVariable Long orderId,
                                                 @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
