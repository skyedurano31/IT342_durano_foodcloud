package edu.cit.durano.foodcloud.repository;

import edu.cit.durano.foodcloud.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
}
