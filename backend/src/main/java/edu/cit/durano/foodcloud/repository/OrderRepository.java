package edu.cit.durano.foodcloud.repository;

import edu.cit.durano.foodcloud.entity.Order;
import edu.cit.durano.foodcloud.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserId(Long userId);
}
