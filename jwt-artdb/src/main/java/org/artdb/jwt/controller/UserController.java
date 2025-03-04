package org.artdb.jwt.controller;

import jakarta.annotation.PostConstruct;
import org.artdb.jwt.entity.User;
import org.artdb.jwt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostConstruct
    public void initRolesAndUser(){
        userService.initRolesAndUsers();
    }

    @PostMapping({"/registerNewUser"})
    public User registerNewUser(@RequestBody User user) {
        return userService.registerNewUser(user);

    }

    @GetMapping({"/forAdmin"})
    public String forAdmin() {
        return "This URL is only accessible for admin";
    }

    @GetMapping({"/forUser"})
    public String forUser() {
        return "This URL is accessible for user";
    }
}
