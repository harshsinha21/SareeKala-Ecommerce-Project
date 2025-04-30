package org.sareekala.backend.dao;


import org.sareekala.backend.entity.OrderDetail;
import org.springframework.data.repository.CrudRepository;

public interface OrderDetailDao extends CrudRepository<OrderDetail, Integer> {
}
