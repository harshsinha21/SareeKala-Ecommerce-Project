package org.sareekala.backend.controller;

import org.sareekala.backend.entity.Image;
import org.sareekala.backend.entity.Product;
import org.sareekala.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @PreAuthorize("hasRole('Admin')")
    @PostMapping(value = {"/addNewProduct"}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Product addNewProduct(@RequestPart("product") Product product,
                                 @RequestPart("imageFile") MultipartFile[] file){
        try {
            Set<Image> images = uploadImage(file);
            product.setProductImages(images);
            return productService.addNewProduct(product);
        } catch(Exception e) {
            System.out.println(e.getMessage());
            return null;
        }

    }

    public Set<Image> uploadImage(MultipartFile[] multipartFiles) throws IOException {
        Set<Image> images = new HashSet<>();
        for(MultipartFile file: multipartFiles) {
            Image image = new Image(
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getBytes()
            );
            images.add(image);

        }
        return images;
    }

    //@PreAuthorize("hasRole('Admin')")
    @GetMapping({"/getAllProducts"})
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping({"/getProductById/{productId}"})
    public Product getProductById(@PathVariable("productId") Integer productId) {
        return productService.getProductById(productId);
    }

    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping({"/deleteProduct/{productId}"})
    public void deleteProduct(@PathVariable("productId") Integer productId) {
        productService.deleteProduct(productId);
    }

}
