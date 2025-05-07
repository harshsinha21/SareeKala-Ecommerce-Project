package org.sareekala.backend.controller;

import org.sareekala.backend.entity.OrderDetail;
import org.sareekala.backend.entity.OrderInput;
import org.sareekala.backend.entity.OrderProductQuantity;
import org.sareekala.backend.service.OrderDetailService;
import org.sareekala.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    @PreAuthorize("hasRole('User')")
    @PostMapping({"/placeOrder/{isSingleProductCheckout}"})
    public void placeOrder(@PathVariable(name = "isSingleProductCheckout") boolean isCartCheckout, @RequestBody OrderInput orderInput) {
        orderDetailService.placeOrder(orderInput, isCartCheckout);

    }

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
}
