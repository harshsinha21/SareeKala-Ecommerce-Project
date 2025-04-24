package org.sareekala.backend.service;

import org.sareekala.backend.dao.ProductDao;
import org.sareekala.backend.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductDao productDao;

    public Product addNewProduct(Product product) {
        return productDao.save(product);
    }

    public List<Product> getAllProducts() {
        return (List<Product>) productDao.findAll();

    }

    public Product getProductById(Integer productId) {
        return productDao.findById(productId).get();
    }

    public void deleteProduct(Integer productId) {
        productDao.deleteById(productId);
    }
}
