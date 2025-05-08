package org.sareekala.backend.service;

import org.aspectj.weaver.ast.Or;
import org.hibernate.query.Order;
import org.sareekala.backend.configuration.JwtRequestFilter;
import org.sareekala.backend.dao.CartDao;
import org.sareekala.backend.dao.OrderDetailDao;
import org.sareekala.backend.dao.ProductDao;
import org.sareekala.backend.dao.UserDao;
import org.sareekala.backend.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderDetailService {

    private static final String ORDER_PLACED  = "Placed";

    private static final String KEY = "src/main/java/org/sareekala/backend/service/publish_key.pem";

    private static final String KEY_SECRET = "src/main/java/org/sareekala/backend/service/secret_key.pem";

    private static final String CURRENT = "CAD";

    @Autowired
    private OrderDetailDao orderDetailDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private CartDao cartDao;

    public List<OrderDetail> getOrderDetails() {
        String username = JwtRequestFilter.CURRENT_USER;
        User user = userDao.findById(username).get();

        return orderDetailDao.findByUser(user);
    }

    public List<OrderDetail> getAllOrderDetails(String status) {
        List<OrderDetail> orderDetails = new ArrayList<>();
        if(status.equals("All")) {
            orderDetailDao.findAll().forEach(
                    x -> orderDetails.add(x)
            );
        } else {
            orderDetailDao.findByOrderStatus(status).forEach(
                    x -> orderDetails.add(x)
            );
        }

        return orderDetails;
    }

    public void markOrderStatus(Integer orderId) {
        OrderDetail orderDetail = orderDetailDao.findById(orderId).get();

        if(orderDetail != null) {
            orderDetail.setOrderStatus("Delivered");
            orderDetailDao.save(orderDetail);
        }
    }

    public void createTransaction(Double amount) {
        
    }

    public void placeOrder(OrderInput orderInput, boolean isSingleProductCheckout) {
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

            if(!isSingleProductCheckout) {
                List<Cart> cartItems = cartDao.findByUser(user);
                cartItems.stream().forEach(x -> cartDao.deleteById(x.getCartId()));
            }

            orderDetailDao.save(orderDetail);
        }




    }
}
