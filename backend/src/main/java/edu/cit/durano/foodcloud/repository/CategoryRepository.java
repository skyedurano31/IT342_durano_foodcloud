package edu.cit.durano.foodcloud.repository;

import edu.cit.durano.foodcloud.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {
}
