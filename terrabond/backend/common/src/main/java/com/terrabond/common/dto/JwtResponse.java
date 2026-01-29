package com.terrabond.common.dto;

import com.terrabond.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private Set<Role> roles;
    private boolean faceVerified;
    private boolean twoFactorEnabled;
}
