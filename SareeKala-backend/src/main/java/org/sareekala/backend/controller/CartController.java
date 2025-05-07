package org.sareekala.backend.controller;

import org.sareekala.backend.entity.Cart;
import org.sareekala.backend.entity.CartItem;
import org.sareekala.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CartController {

    @Autowired
    private CartService cartService;

    @PreAuthorize("hasRole('User')")
    @GetMapping({"/addToCart/{productId}"})
    public Cart addToCart(@PathVariable(name = "productId") Integer productId) {
        return cartService.addToCart(productId);
    }

    @PreAuthorize("hasRole('User')")
    @DeleteMapping({"/deleteCartItem/{cartId}"})
    public void deleteCartItem(@PathVariable(name = "cartId") Integer cartId) {
        cartService.deleteCartItem(cartId);
    }

    @PreAuthorize("hasRole('User')")
    @GetMapping({"/getCartDetails"})
    public List<Cart> getCartDetails() {
        return cartService.getCartDetails();
    }

    @PutMapping("/item/{id}")
    public ResponseEntity<CartItem> updateQuantity(
            @PathVariable("id") Integer cartItemId,
            @RequestParam("quantity") Integer quantity) {
        CartItem updated = cartService.updateCartItemQuantity(cartItemId, quantity);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
