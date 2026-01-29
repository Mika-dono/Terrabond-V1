package com.terrabond.common.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String password;
    
    private String twoFactorCode;
    private boolean useFaceRecognition;
    private String faceData;
}
