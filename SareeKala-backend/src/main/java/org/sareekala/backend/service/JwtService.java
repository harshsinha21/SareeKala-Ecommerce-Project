package org.sareekala.backend.service;

import org.sareekala.backend.dao.UserDao;
import org.sareekala.backend.entity.JwtRequest;
import org.sareekala.backend.entity.JwtResponse;
import org.sareekala.backend.entity.User;
import org.sareekala.backend.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class JwtService implements UserDetailsService {

    private final UserDao userDao;
    private final JwtUtil jwtUtil;
    private AuthenticationManager authenticationManager; // Removed @Autowired

    public JwtService(UserDao userDao, JwtUtil jwtUtil) {
        this.userDao = userDao;
        this.jwtUtil = jwtUtil;
    }

    // Setter-based injection to avoid circular dependency
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public JwtResponse createJwtToken(JwtRequest jwtRequest) throws Exception {
        String userName = jwtRequest.getUserName();
        String userPassword = jwtRequest.getUserPassword();
        //Debug log the username and password before authenticating
        System.out.println("Attempting to create JWT token for user: " + userName);
        authenticate(userName, userPassword);
        final UserDetails userDetails = loadUserByUsername(userName);
        String newToken = jwtUtil.generateToken(userDetails);
        //Debug log the generated token
        System.out.println("Generated JWT token for user: " + userName);
        User user = userDao.findById(userName).get();
        return new JwtResponse(user, newToken);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDao.findById(username).orElseThrow(() -> new UsernameNotFoundException("Username is not valid"));
        return new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getUserPassword(),
                getAuthorities(user));
    }

    private Set<SimpleGrantedAuthority> getAuthorities(User user) {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        user.getRole().forEach(role -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRoleName())));
        return authorities;
    }

    private void authenticate(String userName, String userPassword) throws Exception {
        try {
            //Debug log the authentication attempt
            System.out.println("Authenticating user: " + userName);
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userName, userPassword));
            //Debug log successful authentication attempt
            System.out.println("Authentication successful for user: " + userName);
        } catch (DisabledException e) {
            //Debug log locked user
            System.out.println("User is locked: " + userName);
            throw new Exception("User is locked");
        } catch (BadCredentialsException e) {
            //Debug log invalid user
            System.out.println("Invalid credentials for user: " + userName);
            throw new Exception("Invalid Credentials from User");
        }
    }
}
