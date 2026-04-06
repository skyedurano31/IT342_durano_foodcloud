package edu.cit.durano.foodcloud.repository;

import edu.cit.durano.foodcloud.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart,Long> {
}
