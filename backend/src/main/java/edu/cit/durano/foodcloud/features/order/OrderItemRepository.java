package edu.cit.durano.foodcloud.repository;

import edu.cit.durano.foodcloud.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
}
