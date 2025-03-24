package org.sareekala.backend.service;

import org.sareekala.backend.dao.ProductDao;
import org.sareekala.backend.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @Autowired
    private ProductDao productDao;

    public Product addNewProduct(Product product) {
        return productDao.save(product);
    }
}
