package com.terrabond.auth.service;

import com.terrabond.auth.entity.User;
import com.terrabond.auth.repository.UserRepository;
import com.terrabond.common.dto.*;
import com.terrabond.common.enums.Role;
import com.terrabond.common.security.JwtUtils;
import com.terrabond.common.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final RestTemplate restTemplate;
    
    private static final String AI_SERVICE_URL = "http://ai-service:8000";
    
    @Transactional
    public ApiResponse<JwtResponse> register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("Email already registered");
        }
        
        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return ApiResponse.error("Username already taken");
        }
        
        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .faceEncodingData(request.getFaceEncodingData())
                .faceVerified(request.getFaceEncodingData() != null)
                .roles(new HashSet<>(Set.of(Role.USER)))
                .isActive(true)
                .build();
        
        userRepository.save(user);
        
        log.info("User registered successfully: {}", user.getEmail());
        
        // Auto login after registration
        return login(new LoginRequest(request.getEmail(), request.getPassword(), null, false, null));
    }
    
    @Transactional
    public ApiResponse<JwtResponse> login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        try {
            // Find user
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
            
            // Check if user is active
            if (!user.isActive() || user.isBanned()) {
                return ApiResponse.error("Account is disabled or banned");
            }
            
            // Face recognition login
            if (request.isUseFaceRecognition() && request.getFaceData() != null) {
                boolean faceMatch = verifyFace(user.getFaceEncodingData(), request.getFaceData());
                if (!faceMatch) {
                    return ApiResponse.error("Face recognition failed");
                }
            } else {
                // Standard password authentication
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            
            // Check 2FA if enabled
            if (user.isTwoFactorEnabled()) {
                if (request.getTwoFactorCode() == null || !verify2FA(user.getTwoFactorSecret(), request.getTwoFactorCode())) {
                    return ApiResponse.error("2FA code required or invalid");
                }
            }
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // Generate JWT
            String jwt = jwtUtils.generateTokenFromUsername(user.getEmail(), user.getId(), user.getRoles());
            
            JwtResponse response = JwtResponse.builder()
                    .token(jwt)
                    .type("Bearer")
                    .id(user.getId())
                    .email(user.getEmail())
                    .username(user.getUsername())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .roles(user.getRoles())
                    .faceVerified(user.isFaceVerified())
                    .twoFactorEnabled(user.isTwoFactorEnabled())
                    .build();
            
            log.info("User logged in successfully: {}", user.getEmail());
            return ApiResponse.success("Login successful", response);
            
        } catch (BadCredentialsException e) {
            log.warn("Failed login attempt for email: {}", request.getEmail());
            return ApiResponse.error("Invalid email or password");
        }
    }
    
    @Transactional
    public ApiResponse<String> logout(Long userId) {
        log.info("User logged out: {}", userId);
        SecurityContextHolder.clearContext();
        return ApiResponse.success("Logout successful", null);
    }
    
    @Transactional
    public ApiResponse<String> enable2FA(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate 2FA secret
        String secret = generate2FASecret();
        user.setTwoFactorSecret(secret);
        user.setTwoFactorEnabled(true);
        userRepository.save(user);
        
        return ApiResponse.success("2FA enabled successfully", secret);
    }
    
    @Transactional
    public ApiResponse<String> disable2FA(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setTwoFactorSecret(null);
        user.setTwoFactorEnabled(false);
        userRepository.save(user);
        
        return ApiResponse.success("2FA disabled successfully", null);
    }
    
    @Transactional
    public ApiResponse<String> registerFace(Long userId, String faceEncodingData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify face quality via AI service
        boolean validFace = validateFaceQuality(faceEncodingData);
        if (!validFace) {
            return ApiResponse.error("Face quality check failed. Please try again with better lighting.");
        }
        
        user.setFaceEncodingData(faceEncodingData);
        user.setFaceVerified(true);
        userRepository.save(user);
        
        return ApiResponse.success("Face registered successfully", null);
    }
    
    private boolean verifyFace(String storedFaceData, String providedFaceData) {
        try {
            // Call AI service for face verification
            FaceVerificationRequest request = new FaceVerificationRequest(storedFaceData, providedFaceData);
            FaceVerificationResponse response = restTemplate.postForObject(
                    AI_SERVICE_URL + "/api/face/verify",
                    request,
                    FaceVerificationResponse.class
            );
            return response != null && response.isMatch();
        } catch (Exception e) {
            log.error("Face verification error", e);
            return false;
        }
    }
    
    private boolean validateFaceQuality(String faceData) {
        try {
            FaceQualityRequest request = new FaceQualityRequest(faceData);
            FaceQualityResponse response = restTemplate.postForObject(
                    AI_SERVICE_URL + "/api/face/quality",
                    request,
                    FaceQualityResponse.class
            );
            return response != null && response.isValid();
        } catch (Exception e) {
            log.error("Face quality check error", e);
            return true; // Allow on error
        }
    }
    
    private boolean verify2FA(String secret, String code) {
        // Implement TOTP verification
        // This is a simplified version - use a proper TOTP library in production
        return true;
    }
    
    private String generate2FASecret() {
        // Generate random secret for TOTP
        return java.util.Base64.getEncoder().encodeToString(
                java.security.SecureRandom.getSeed(32)
        );
    }
    
    // Inner classes for AI service requests
    @lombok.Data
    private static class FaceVerificationRequest {
        private final String storedFace;
        private final String providedFace;
    }
    
    @lombok.Data
    private static class FaceVerificationResponse {
        private boolean match;
        private double confidence;
    }
    
    @lombok.Data
    private static class FaceQualityRequest {
        private final String faceData;
    }
    
    @lombok.Data
    private static class FaceQualityResponse {
        private boolean valid;
        private double qualityScore;
    }
}
