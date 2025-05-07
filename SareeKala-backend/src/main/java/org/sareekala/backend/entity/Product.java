package org.sareekala.backend.entity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
public class Product {

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private Integer productId;
    private String productName;

    private Integer quantity;
    @Column(length = 2000)
    private String productDesc;
    private Double productPrice;
    private Double productDiscountedPrice;
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "product_images",
            joinColumns = {
            @JoinColumn(name = "product_id")

            },
            inverseJoinColumns = {
                @JoinColumn(name = "image_id")
            }
    )
    private Set<Image> productImages;

    public Set<Image> getProductImages() {
        return productImages;
    }

    public void setProductImages(Set<Image> productImages) {
        this.productImages = productImages;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    public String getProductDesc() {
        return productDesc;
    }

    public void setProductDesc(String productDesc) {
        this.productDesc = productDesc;
    }

    public Double getProductDiscountedPrice() {
        return productDiscountedPrice;
    }

    public void setProductDiscountedPrice(Double productDiscountedPrice) {
        this.productDiscountedPrice = productDiscountedPrice;
    }

    public Double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Double productPrice) {
        this.productPrice = productPrice;
    }
}
