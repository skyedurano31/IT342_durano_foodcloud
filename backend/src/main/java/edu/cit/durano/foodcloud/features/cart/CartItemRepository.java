package edu.cit.durano.foodcloud.repository;

import edu.cit.durano.foodcloud.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {
}
