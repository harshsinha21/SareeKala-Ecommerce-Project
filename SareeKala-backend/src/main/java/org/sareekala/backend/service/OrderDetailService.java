package org.sareekala.backend.service;

import org.aspectj.weaver.ast.Or;
import org.sareekala.backend.configuration.JwtRequestFilter;
import org.sareekala.backend.dao.OrderDetailDao;
import org.sareekala.backend.dao.ProductDao;
import org.sareekala.backend.dao.UserDao;
import org.sareekala.backend.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService {

    private static final String ORDER_PLACED  = "Placed";

    @Autowired
    private OrderDetailDao orderDetailDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private UserDao userDao;

    public void placeOrder(OrderInput orderInput) {
        List<OrderProductQuantity> productQuantityList = orderInput.getOrderProductQuantityList();

        for(OrderProductQuantity o: productQuantityList)
        {
            Product product = productDao.findById(o.getProductId()).get();
            String currentUser = JwtRequestFilter.CURRENT_USER;
            User user = userDao.findById(currentUser).get();

            OrderDetail orderDetail = new OrderDetail(
                    orderInput.getFullName(),
                    orderInput.getFullAddress(),
                    orderInput.getContactNumber(),
                    ORDER_PLACED,
                    product.getProductPrice() * o.getQuantity(),
                    product,
                    user

            );

            orderDetailDao.save(orderDetail);
        }
    }
}
