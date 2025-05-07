package org.sareekala.backend.service;

import org.sareekala.backend.configuration.JwtRequestFilter;
import org.sareekala.backend.dao.CartDao;
import org.sareekala.backend.dao.ProductDao;
import org.sareekala.backend.dao.UserDao;
import org.sareekala.backend.entity.Cart;
import org.sareekala.backend.entity.CartItem;
import org.sareekala.backend.entity.Product;
import org.sareekala.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.sareekala.backend.entity.ProductCheckoutDTO;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductDao productDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private CartDao cartDao;

    public Product addNewProduct(Product product) {
        return productDao.save(product);
    }

    public List<Product> getAllProducts(int pagenumber, String searchKey) {
        Pageable pageable = PageRequest.of(pagenumber, 16);
        if(searchKey.equals("")) {
            return (List<Product>) productDao.findAll(pageable);
        } else {
            return (List<Product>) productDao.findByProductNameContainingIgnoreCaseOrProductDescContainingIgnoreCase(searchKey, searchKey, pageable);
        }

    }

    public Product getProductById(Integer productId) {
        return productDao.findById(productId).get();
    }

    public void deleteProduct(Integer productId) {
        productDao.deleteById(productId);
    }

    public List<ProductCheckoutDTO> getProductDetails(boolean isSingleProductCheckout, Integer productId) {
        List<ProductCheckoutDTO> checkoutList = new ArrayList<>();

        // Fetch user information from JWT (the current logged-in user)
        String username = JwtRequestFilter.CURRENT_USER;
        User user = userDao.findById(username).orElse(null);

        if (user != null) {
            // Fetch the cart for the user (should be only one cart per user)
            List<Cart> cartList = cartDao.findByUser(user);

            if (!cartList.isEmpty()) {
                Cart cart = cartList.get(0);  // User has only one cart, get the first one

                if (isSingleProductCheckout && productId != 0) {
                    // If single product checkout, fetch the product and corresponding CartItem
                    Product product = productDao.findById(productId).orElse(null);
                    if (product != null) {
                        // Find the CartItem for this product in the user's cart
                        CartItem cartItem = cart.getItems().stream()
                                .filter(item -> item.getProduct().getProductId().equals(productId))
                                .findFirst()
                                .orElse(null);

                        if (cartItem != null) {
                            // DEBUGGING: Check CartItem details
                            System.out.println("CartItem found for user (CartID: " + cart.getCartId() + "), ProductID: " + productId + ", CartItemId: " + cartItem.getId() + ", Quantity: " + cartItem.getQuantity());

                            // Construct the DTO with the correct CartId and CartItemId
                            ProductCheckoutDTO dto = new ProductCheckoutDTO(
                                    product.getProductId(),
                                    product.getProductName(),
                                    product.getProductDesc(),
                                    product.getProductPrice(),
                                    cartItem.getQuantity(),  // Quantity from CartItem
                                    product.getQuantity(),  // Available product stock
                                    cartItem.getId(),  // CartItem ID
                                    cart.getCartId()  // CartId (unique to the user)
                            );
                            checkoutList.add(dto);
                        } else {
                            System.out.println("No CartItem found for productId " + productId + " in the user's cart.");
                        }
                    }
                } else {
                    // For multiple products in the cart
                    for (CartItem cartItem : cart.getItems()) {
                        Product product = cartItem.getProduct();
                        // DEBUGGING: Check CartItem details for each item
                        System.out.println("CartItem found for user (CartID: " + cart.getCartId() + "), ProductID: " + product.getProductId() + ", CartItemId: " + cartItem.getId() + ", Quantity: " + cartItem.getQuantity());

                        // Construct the DTO with the correct CartId and CartItemId
                        ProductCheckoutDTO dto = new ProductCheckoutDTO(
                                product.getProductId(),
                                product.getProductName(),
                                product.getProductDesc(),
                                product.getProductPrice(),
                                cartItem.getQuantity(),  // Quantity from CartItem
                                product.getQuantity(),  // Available product stock
                                cartItem.getId(),  // CartItem ID
                                cart.getCartId()  // CartId (unique to the user)
                        );
                        checkoutList.add(dto);
                    }
                }
            } else {
                System.out.println("No cart found for user " + username);
            }
        } else {
            System.out.println("No user found with username " + username);
        }

        return checkoutList;
    }


}
