package org.artdb.jwt.configuration;

import io.jsonwebtoken.ExpiredJwtException;
import org.artdb.jwt.service.JwtService;
import org.artdb.jwt.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String header = request.getHeader("Authorization");

        String jwtToken = null;
        String userName = null;

        //Debug Log Authorization Header
        System.out.println("Authorization Header:" + header);

        if(header != null && header.startsWith("Bearer "))
        {
            jwtToken = header. substring(7);

            try {
                //Debug Print Log
                System.out.println("Extracting JWT token: " + jwtToken);
                userName = jwtUtil.getUserNameFromToken(jwtToken);
                //Debug Print Log
                System.out.println("Extracted username from token: " + userName);
            } catch (IllegalArgumentException e) {
                System.out.println("Unable to get JwtToken");
            } catch (ExpiredJwtException e) {
                System.out.println("JwtToken is expired");
            }
        } else {
            System.out.println("Jwt token does not start with Bearer");
        }
        if(userName != null && SecurityContextHolder.getContext().getAuthentication() == null)
        {
            UserDetails userDetails = jwtService.loadUserByUsername(userName);
            if(jwtUtil.validateToken(jwtToken, userDetails))
            {
                //Debug validated Token
                System.out.println("Token is valid for user: " + userName);
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            } else {
                //Debug failed Token validation
                System.out.println("Token validation failed for user: " + userName);
            }
        } else {
            //Debug Token not found
            System.out.println("User is not authenticated or no token found.");
        }

        filterChain.doFilter(request, response);
    }

}
