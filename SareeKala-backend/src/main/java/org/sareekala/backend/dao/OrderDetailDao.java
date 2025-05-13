package org.sareekala.backend.dao;


import org.sareekala.backend.entity.OrderDetail;
import org.sareekala.backend.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface OrderDetailDao extends CrudRepository<OrderDetail, Integer> {
    public List<OrderDetail> findByUser(User user);

    public List<OrderDetail> findByOrderStatus(String status);

    OrderDetail findBySessionId(String sessionId);
}
