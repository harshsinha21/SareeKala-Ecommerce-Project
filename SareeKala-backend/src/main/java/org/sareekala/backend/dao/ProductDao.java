package org.sareekala.backend.dao;

import org.sareekala.backend.entity.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDao extends CrudRepository<Product, Integer> {
}
