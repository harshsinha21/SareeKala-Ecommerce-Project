package org.sareekala.backend.service;

import org.sareekala.backend.configuration.JwtRequestFilter;
import org.sareekala.backend.dao.CartDao;
import org.sareekala.backend.dao.CartItemDao;
import org.sareekala.backend.dao.ProductDao;
import org.sareekala.backend.dao.UserDao;
import org.sareekala.backend.entity.Cart;
import org.sareekala.backend.entity.CartItem;
import org.sareekala.backend.entity.Product;
import org.sareekala.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class CartService {

    @Autowired
    private CartDao cartDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private CartItemDao cartItemDao;


    public Cart addToCart(Integer productId) {
        // Retrieve the product to be added to the cart
        Product product = productDao.findById(productId).orElse(null);
        if (product == null) {
            return null; // Product not found
        }

        // Get the current user from the JWT token
        String username = JwtRequestFilter.CURRENT_USER;
        User user = username != null ? userDao.findById(username).orElse(null) : null;
        if (user == null) {
            return null; // User not found
        }

        // Retrieve or create the user's cart
        Cart cart = cartDao.findByUser(user).stream().findFirst().orElse(new Cart(user));

        // If the cart is newly created, save it first
        if (cart.getCartId() == null) {
            cartDao.save(cart); // Persist the new cart
        }

        // Check if the product is already in the cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            // If product is already in the cart, increase the quantity
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + 1); // Increase quantity if item already exists
            cartItemDao.save(item); // Save updated CartItem
        } else {
            // If the product is not in the cart, create a new CartItem
            CartItem cartItem = new CartItem(cart, product, 1); // Set initial quantity to 1
            cart.getItems().add(cartItem); // Add the item to the cart
            cartItemDao.save(cartItem); // Save the CartItem
        }

        // Save the cart again to reflect the changes in the cart's items
        cartDao.save(cart);
        return cart;
    }


    public List<Cart> getCartDetails() {
        String username = JwtRequestFilter.CURRENT_USER;
        User user = userDao.findById(username).orElse(null);
        if (user != null) {
            return cartDao.findByUser(user);
        }
        return Collections.emptyList();
    }

    public void deleteCartItem(Integer cartItemId) {
        Optional<CartItem> cartItem = cartItemDao.findById(cartItemId);
        cartItem.ifPresent(item -> {
            Cart cart = item.getCart();
            cart.getItems().remove(item); // Remove the item from the cart
            cartItemDao.delete(item); // Delete the cart item
            cartDao.save(cart); // Save the updated cart
        });
    }

    public CartItem updateCartItemQuantity(Integer cartItemId, int newQuantity) {
        CartItem cartItem = cartItemDao.findById(cartItemId).orElse(null);
        if (cartItem != null && newQuantity > 0) {
            cartItem.setQuantity(newQuantity);
            return cartItemDao.save(cartItem);
        }
        return null;
    }




}
