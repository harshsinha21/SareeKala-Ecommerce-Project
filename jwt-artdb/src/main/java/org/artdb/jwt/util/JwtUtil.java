package org.artdb.jwt.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "this_is_a_very_secret_key_shh";


    // Token validity in seconds (5 hours)
    private static final int TOKEN_VALIDITY = 18000;

    // Load the EC Private key for signing
    private PrivateKey getPrivateKey() {
        try {
            // Load your EC private key here (or use a method to read the key from the file)
            return Keys.keyPairFor(io.jsonwebtoken.SignatureAlgorithm.ES512).getPrivate();
        } catch (Exception e) {
            throw new RuntimeException("Error loading private key", e);
        }
    }
    private PublicKey getPublicKey() {
        try {
            return Keys.keyPairFor(io.jsonwebtoken.SignatureAlgorithm.ES512).getPublic();
        } catch (Exception e) {
            throw new RuntimeException("Error loading public key", e);
        }
    }

    public String getUserNameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(getPublicKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = getUserNameFromToken(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        final Date expirationDate = getExpirationDateFromToken(token);
        return expirationDate.before(new Date());
    }

    private Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY * 1000))
                .signWith(getPrivateKey(), io.jsonwebtoken.SignatureAlgorithm.ES512)
                .compact();
    }
}

