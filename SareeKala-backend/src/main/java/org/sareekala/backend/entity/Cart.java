package org.sareekala.backend.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import org.sareekala.backend.entity.User;

@Entity
@Table
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer cartId;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // For the forward part of the relationship
    private List<CartItem> items = new ArrayList<>();

    @OneToOne
    private User user;

    public Cart(){

    }

    public Cart(User user) {
        this.user = user;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public Integer getCartId() {
        return cartId;
    }

    public void setCartId(Integer cartId) {
        this.cartId = cartId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
