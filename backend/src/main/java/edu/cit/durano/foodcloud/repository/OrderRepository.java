package edu.cit.durano.foodcloud.repository;

import edu.cit.durano.foodcloud.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order,Long> {
}
