package org.artdb.jwt.controller;

import jakarta.annotation.PostConstruct;
import org.artdb.jwt.entity.User;
import org.artdb.jwt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    @PreAuthorize("hasRole('Admin')")
//    @CrossOrigin(origins = "http://localhost:4200")
    public String forAdmin() {
        return "This URL is only accessible for admin";
    }

    @GetMapping({"/forUser"})
    @PreAuthorize("hasRole('User')")
    public String forUser() {
        return "This URL is accessible for user";
    }

//    @RequestMapping(value = "/forAdmin", method = RequestMethod.OPTIONS)
//    @CrossOrigin(origins = "http://localhost:4200")
//    public ResponseEntity<Void> preflight() {
//        return ResponseEntity.ok().build();
//    }
}
