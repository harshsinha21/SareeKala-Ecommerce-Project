package org.sareekala.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.sareekala.backend.dao.ProductDao;
import org.sareekala.backend.entity.OrderProductQuantity;
import org.sareekala.backend.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;

@Service
public class StripeService {

    @Autowired
    private ProductDao productDao;

    @Value("${stripe.secret.key}")
    private String secretKey;

    @Value("${stripe.publishable.key}")
    private String publishableKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @PostConstruct
    public void init() {
        // This will be called after the bean is initialized
        //System.out.println("Stripe Secret Key after initialization: " + secretKey);
        Stripe.apiKey = secretKey;
    }

    //test
    public String getPublishableKey() {
        // Print the publishable key to the console
        //System.out.println("Stripe Publishable Key: " + publishableKey);
        return publishableKey;
    }


    public Session createCheckoutSession(List<OrderProductQuantity> orderItems, String fullName, String address, String contact, String userId, long totalAmount) throws StripeException, JsonProcessingException {
        // Convert order items to JSON
        String orderItemsJson = new ObjectMapper().writeValueAsString(orderItems);

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:4200/order-success")
                .setCancelUrl("http://localhost:4200/order-failure")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("cad")
                                                .setUnitAmount(totalAmount * 100) // Convert to cents
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Order Payment")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .putMetadata("fullName", fullName)
                .putMetadata("fullAddress", address)  // Changed key to match the webhook controller
                .putMetadata("contactNumber", contact)  // Changed key to match the webhook controller
                .putMetadata("userId", userId)
                .putMetadata("orderItems", orderItemsJson)  // Changed key to match the webhook controller
                .build();

        return Session.create(params);
    }

}



