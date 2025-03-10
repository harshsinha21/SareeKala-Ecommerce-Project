package org.sareekala.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final String PRIVATE_KEY_PATH = "src/main/java/org/sareekala/backend/util/private_key_secp521_pkcs8.pem";
    private static final String PUBLIC_KEY_PATH = "src/main/java/org/sareekala/backend/util/public_key_secp521.pem";

    // Token validity in seconds (5 hours)
    private static final int TOKEN_VALIDITY = 18000;

    // Load the EC Private key for signing
    private PrivateKey getPrivateKey() {
        try {
            System.out.println("Loading private key from path: " + PRIVATE_KEY_PATH);
            // Load the private key file
            File keyFile = new File(PRIVATE_KEY_PATH);
            String privateKeyPEM = new String(Files.readAllBytes(keyFile.toPath()), StandardCharsets.UTF_8);

            // Clean the private key string by removing the headers/footers
            privateKeyPEM = privateKeyPEM
                    .replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "");

            // Remove any unwanted whitespace, newlines, or carriage returns
            privateKeyPEM = privateKeyPEM.replaceAll("\\s+", "");

            // Decode the cleaned Base64 string
            byte[] decodedKey = Base64.getDecoder().decode(privateKeyPEM);

            // Generate the PrivateKey from the decoded byte array
            KeyFactory keyFactory = KeyFactory.getInstance("EC");
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);
            return keyFactory.generatePrivate(keySpec);

        } catch (Exception e) {
            throw new RuntimeException("Error loading private key", e);
        }
    }

    private PublicKey getPublicKey() {
        try {
            // Load the public key file
            File keyFile = new File(PUBLIC_KEY_PATH);
            String publicKeyPEM = new String(Files.readAllBytes(keyFile.toPath()), StandardCharsets.UTF_8);

            // Clean the public key string
            publicKeyPEM = publicKeyPEM
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replace("-----END PUBLIC KEY-----", "");

            // Remove any unwanted newlines or spaces
            publicKeyPEM = publicKeyPEM.replaceAll("\\s+", "");

            // Decode the cleaned Base64 string
            byte[] decodedKey = Base64.getDecoder().decode(publicKeyPEM);

            // Generate the PublicKey from the decoded byte array
            KeyFactory keyFactory = KeyFactory.getInstance("EC");
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decodedKey);
            return keyFactory.generatePublic(keySpec);

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
                .signWith(getPrivateKey(), SignatureAlgorithm.ES512)
                .compact();
    }
}

