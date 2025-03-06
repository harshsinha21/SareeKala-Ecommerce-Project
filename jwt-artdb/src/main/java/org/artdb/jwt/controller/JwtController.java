package org.artdb.jwt.controller;

import org.artdb.jwt.entity.JwtRequest;
import org.artdb.jwt.entity.JwtResponse;
import org.artdb.jwt.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class JwtController {

    @Autowired
    private JwtService jwtService;

    @PostMapping({"/authenticate"})
    public JwtResponse createNewJwtToken(@RequestBody JwtRequest jwtRequest) throws Exception {
       JwtResponse jwtResponse = jwtService.createJwtToken(jwtRequest);
       return jwtResponse;
    }
}
