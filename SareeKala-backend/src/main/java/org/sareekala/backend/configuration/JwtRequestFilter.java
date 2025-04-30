package org.sareekala.backend.configuration;

import io.jsonwebtoken.ExpiredJwtException;
import org.sareekala.backend.service.JwtService;
import org.sareekala.backend.util.JwtUtil;
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

    public static String CURRENT_USER = "";

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
                userName = jwtUtil.getUserNameFromToken(jwtToken);
                CURRENT_USER = userName;
                //Debug Print Log
                System.out.println("Extracted username from token: " + userName);
            } catch (IllegalArgumentException e) {
                System.out.println("Unable to get JwtToken");
            } catch (ExpiredJwtException e) {
                System.out.println("JwtToken is expired");
            }
        }
        if(userName != null && SecurityContextHolder.getContext().getAuthentication() == null)
        {
            UserDetails userDetails = jwtService.loadUserByUsername(userName);
            if(jwtUtil.validateToken(jwtToken, userDetails))
            {
                //Debug validated Token
                System.out.println("User roles: " + userDetails.getAuthorities());
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            } else {
                //Debug failed Token validation
                System.out.println("Token validation failed for user: " + userName);
                response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 Forbidden
                response.getWriter().write("Access Denied: You don't have permission to access this resource");
            }
        }


        filterChain.doFilter(request, response);
    }

}
