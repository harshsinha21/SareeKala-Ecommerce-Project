package org.sareekala.backend.entity;

public class TransactionDetails {

    private String transactionId; // Unique transaction identifier
    private String clientSecret;  // Stripe client secret for the frontend
    private String currency;      // Currency used for the transaction (e.g., CAD, USD)
    private String amount;        // Amount in cents (for Stripe, you send amounts in cents)

    // Constructors, Getters, Setters

    public TransactionDetails(String transactionId, String clientSecret, String currency, String amount) {
        this.transactionId = transactionId;
        this.clientSecret = clientSecret;
        this.currency = currency;
        this.amount = amount;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }
}
