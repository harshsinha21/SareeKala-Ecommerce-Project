package org.sareekala.backend.dao;

import org.sareekala.backend.entity.Cart;
import org.sareekala.backend.entity.Product;
import org.sareekala.backend.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CartDao extends CrudRepository<Cart, Integer> {
    public List<Cart> findByUser(User user);
}
