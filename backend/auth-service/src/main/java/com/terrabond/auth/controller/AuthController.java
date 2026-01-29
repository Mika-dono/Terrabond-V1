package com.terrabond.auth.controller;

import com.terrabond.auth.service.AuthService;
import com.terrabond.common.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<JwtResponse>> register(@Valid @RequestBody RegisterRequest request) {
        ApiResponse<JwtResponse> response = authService.register(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request) {
        ApiResponse<JwtResponse> response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestHeader("Authorization") String token) {
        // Extract user ID from token and logout
        ApiResponse<String> response = authService.logout(1L); // TODO: extract from token
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/2fa/enable")
    public ResponseEntity<ApiResponse<String>> enable2FA(@RequestHeader("Authorization") String token) {
        ApiResponse<String> response = authService.enable2FA(1L); // TODO: extract from token
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/2fa/disable")
    public ResponseEntity<ApiResponse<String>> disable2FA(@RequestHeader("Authorization") String token) {
        ApiResponse<String> response = authService.disable2FA(1L); // TODO: extract from token
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/face/register")
    public ResponseEntity<ApiResponse<String>> registerFace(
            @RequestHeader("Authorization") String token,
            @RequestBody FaceRegistrationRequest request) {
        ApiResponse<String> response = authService.registerFace(1L, request.getFaceEncodingData());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(@RequestHeader("Authorization") String token) {
        // Validate token logic
        return ResponseEntity.ok(ApiResponse.success(true));
    }
    
    @lombok.Data
    public static class FaceRegistrationRequest {
        private String faceEncodingData;
    }
}
