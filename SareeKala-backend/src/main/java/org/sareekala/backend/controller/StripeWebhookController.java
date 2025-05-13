package org.sareekala.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.model.checkout.Session;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import org.sareekala.backend.entity.OrderInput;
import org.sareekala.backend.entity.OrderProductQuantity;
import org.sareekala.backend.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    private final ObjectMapper objectMapper;

    @Autowired
    private OrderDetailService orderDetailService;

    public StripeWebhookController(OrderDetailService orderDetailService, ObjectMapper objectMapper) {
        this.orderDetailService = orderDetailService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
                                                      @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            System.out.println("Received webhook request");
            System.out.println("Webhook payload: " + payload);
            System.out.println("Stripe-Signature: " + sigHeader);

            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);

            System.out.println("Received event: " + event.getType());

            if ("checkout.session.completed".equals(event.getType())) {
                Session session = (Session) event.getDataObjectDeserializer()
                        .getObject()
                        .orElse(null);

                if (session != null) {
                    // Extract metadata with corrected keys
                    String sessionId = session.getId();
                    String userId = session.getMetadata().get("userId");
                    String fullName = session.getMetadata().get("fullName");
                    String fullAddress = session.getMetadata().get("fullAddress");
                    String contactNumber = session.getMetadata().get("contactNumber");
                    String orderItemsJson = session.getMetadata().get("orderItems");

                    // Deserialize order items
                    List<OrderProductQuantity> orderItems = objectMapper.readValue(
                            orderItemsJson, new TypeReference<List<OrderProductQuantity>>() {}
                    );

                    // Create OrderInput object
                    OrderInput orderInput = new OrderInput();
                    orderInput.setFullName(fullName);
                    orderInput.setFullAddress(fullAddress);
                    orderInput.setContactNumber(contactNumber);
                    orderInput.setOrderProductQuantityList(orderItems);

                    // Place the order with userId
                    orderDetailService.placeOrder(orderInput, false, userId, sessionId);
                }
            }

            return ResponseEntity.ok("Webhook processed");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal error: " + e.getMessage());
        }
    }
}

