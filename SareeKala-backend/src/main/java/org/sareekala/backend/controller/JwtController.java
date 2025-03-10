package org.sareekala.backend.controller;

import org.sareekala.backend.entity.JwtRequest;
import org.sareekala.backend.entity.JwtResponse;
import org.sareekala.backend.service.JwtService;
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
       return jwtService.createJwtToken(jwtRequest);
    }
}
