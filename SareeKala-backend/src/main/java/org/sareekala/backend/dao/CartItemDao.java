package org.sareekala.backend.dao;

import org.sareekala.backend.entity.Cart;
import org.sareekala.backend.entity.CartItem;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CartItemDao extends CrudRepository<CartItem, Integer> {

    List<CartItem> findByCart(Cart cart);

    void deleteByCart(Cart cart);
}
