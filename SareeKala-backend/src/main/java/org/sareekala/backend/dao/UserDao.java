package org.sareekala.backend.dao;

import org.sareekala.backend.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDao extends CrudRepository<User, String> {
    Optional<User> findByUserName(String userName);
}
