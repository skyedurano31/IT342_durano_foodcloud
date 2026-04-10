package edu.cit.durano.foodcloud.repository;

import edu.cit.durano.foodcloud.entity.Cart;
import edu.cit.durano.foodcloud.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart,Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserId(Long userId);
}
