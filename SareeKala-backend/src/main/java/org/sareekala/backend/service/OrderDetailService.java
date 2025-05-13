package org.sareekala.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OrderDetailService {

    private static final String ORDER_PLACED = "Placed";

    private static final String CURRENCY = "CAD";

    @Autowired
    private OrderDetailDao orderDetailDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private CartDao cartDao;

    @Autowired
    private StripeService stripeService;

    public List<OrderDetail> getOrderDetails() {
        String username = JwtRequestFilter.CURRENT_USER;
        User user = userDao.findById(username).get();

        return orderDetailDao.findByUser(user);
    }

    public List<OrderDetail> getAllOrderDetails(String status) {
        List<OrderDetail> orderDetails = new ArrayList<>();
        if (status.equals("All")) {
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

        if (orderDetail != null) {
            orderDetail.setOrderStatus("Delivered");
            orderDetailDao.save(orderDetail);
        }
    }

    public TransactionDetails createTransaction(OrderInput orderInput, String userId) throws StripeException, JsonProcessingException {
        long totalAmount = 0; // Variable to store the total amount
        for (OrderProductQuantity productQuantity : orderInput.getOrderProductQuantityList()) {
            Product product = productDao.findById(productQuantity.getProductId()).orElse(null);
            if (product != null) {
                totalAmount += product.getProductPrice() * productQuantity.getQuantity();
            }
        }
        Session session = stripeService.createCheckoutSession(
                orderInput.getOrderProductQuantityList(),
                orderInput.getFullName(),
                orderInput.getFullAddress(),
                orderInput.getContactNumber(),
                userId,
                totalAmount
        );

        return new TransactionDetails(
                session.getId(),
                null,
                "CAD",
                String.valueOf(totalAmount)
        );
    }

    private boolean isAddressInCanada(String address) {
        if (address == null) return false;

        String lowerAddress = address.toLowerCase();

        // Check for common Canadian province abbreviations
        String[] canadianProvinces = {"ab", "bc", "mb", "nb", "nl", "ns", "nt", "on", "pe", "qc", "sk", "yt"};
        for (String province : canadianProvinces) {
            if (lowerAddress.contains(province)) {
                return true;
            }
        }

        // Check for common Canadian cities (optional: you can add more cities as needed)
        String[] canadianCities = {"toronto", "vancouver", "montreal", "calgary", "ottawa", "edmonton", "winnipeg", "halifax"};
        for (String city : canadianCities) {
            if (lowerAddress.contains(city)) {
                return true;
            }
        }

        // Postal code validation using regex (e.g., A1A 1A1 format)
        Pattern postalCodePattern = Pattern.compile("([A-Za-z]\\d[A-Za-z])\\s?(\\d[A-Za-z]\\d)");
        Matcher matcher = postalCodePattern.matcher(lowerAddress);
        if (matcher.find()) {
            return true;
        }

        return false; // If no match is found, return false
    }


    public void placeOrder(OrderInput orderInput, boolean isSingleProductCheckout, String userId, String sessionId) {
        if (!isAddressInCanada(orderInput.getFullAddress())) {
            throw new IllegalArgumentException("We only ship to addresses in Canada.");
        }

        List<OrderProductQuantity> productQuantityList = orderInput.getOrderProductQuantityList();
        User user = userDao.findById(userId).orElse(null);

        if (user == null) return; // Optionally log error

        for (OrderProductQuantity o : productQuantityList) {
            Product product = productDao.findById(o.getProductId()).orElse(null);
            if (product == null) continue;

            OrderDetail orderDetail = new OrderDetail(
                    orderInput.getFullName(),
                    orderInput.getFullAddress(),
                    orderInput.getContactNumber(),
                    "Placed",
                    product.getProductPrice() * o.getQuantity(),
                    product,
                    user
            );
            orderDetail.setSessionId(sessionId);
            orderDetailDao.save(orderDetail);
        }

        // Clean up cart
        if (!isSingleProductCheckout) {
            List<Cart> cartItems = cartDao.findByUser(user);
            cartItems.forEach(cart -> cartDao.deleteById(cart.getCartId()));
        }
    }

}
