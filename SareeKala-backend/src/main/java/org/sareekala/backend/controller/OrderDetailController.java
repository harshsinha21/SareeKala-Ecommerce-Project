package org.sareekala.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.stripe.exception.StripeException;
import org.sareekala.backend.configuration.JwtRequestFilter;
import org.sareekala.backend.dao.OrderDetailDao;
import org.sareekala.backend.entity.OrderDetail;
import org.sareekala.backend.entity.OrderInput;
import org.sareekala.backend.entity.OrderProductQuantity;
import org.sareekala.backend.entity.TransactionDetails;
import org.sareekala.backend.service.OrderDetailService;
import org.sareekala.backend.service.ProductService;
import org.sareekala.backend.service.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.stripe.Stripe;


import java.util.List;

@RestController
public class OrderDetailController {

    @Autowired
    private StripeService stripeService;

    @Autowired
    private OrderDetailDao orderDetailDao;

    @Autowired
    private OrderDetailService orderDetailService;

//    @PreAuthorize("hasRole('User')")
//    @PostMapping({"/placeOrder/{isSingleProductCheckout}"})
//    public void placeOrder(@PathVariable(name = "isSingleProductCheckout") boolean isCartCheckout, @RequestBody OrderInput orderInput) {
//        orderDetailService.placeOrder(orderInput, isCartCheckout);
//
//    }

    @PreAuthorize("hasRole('User')")
    @GetMapping({"/getOrderDetails"})
    public List<OrderDetail> getOrderDetails() {
        return orderDetailService.getOrderDetails();
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping({"/getAllOrderDetails/{status}"})
    public List<OrderDetail> getAllOrderDetails(@PathVariable(name = "status") String status) {
        return orderDetailService.getAllOrderDetails(status);
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping({"/updateOrderStatus/{orderId}"})
    public void markOrderStatus(@PathVariable(name = "orderId") Integer orderId) {
        orderDetailService.markOrderStatus(orderId);
    }

    @PreAuthorize("hasRole('User')")
    @PostMapping("/createTransaction")
    public TransactionDetails createTransaction(@RequestBody OrderInput orderInput)
            throws StripeException, JsonProcessingException {

        String userId = JwtRequestFilter.CURRENT_USER;
        return orderDetailService.createTransaction(orderInput, userId);
    }



    @PreAuthorize("hasRole('User')")
    @GetMapping("/testPublishableKey")
    public String testPublishableKey() {
        // Call the service to get the publishable key
        String publishableKey = stripeService.getPublishableKey();
        return "Publishable Key: " + publishableKey;
    }

    // OrderDetailController.java
    @GetMapping("/order/session/{sessionId}")
    public ResponseEntity<OrderDetail> getOrderBySessionId(@PathVariable String sessionId) {
        OrderDetail order = orderDetailDao.findBySessionId(sessionId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
