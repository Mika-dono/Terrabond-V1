package com.terrabond.auth.entity;

import com.terrabond.common.enums.Gender;
import com.terrabond.common.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    private String phone;
    
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    private String nationality;
    private String city;
    private String country;
    private String bio;
    private String profession;
    private String profilePicture;
    private String coverPicture;
    
    @Column(length = 2000)
    private String faceEncodingData;
    
    private boolean faceVerified;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
    
    private boolean isVerified;
    
    @Builder.Default
    private boolean isActive = true;
    
    @Builder.Default
    private boolean isBanned = false;
    
    private boolean twoFactorEnabled;
    private String twoFactorSecret;
    
    @ElementCollection
    @CollectionTable(name = "user_travel_styles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "style")
    @Builder.Default
    private Set<String> travelStyles = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "user_languages", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "language")
    @Builder.Default
    private Set<String> languages = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "user_interests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "interest")
    @Builder.Default
    private Set<String> interests = new HashSet<>();
    
    private String personalityType;
    private String personalityTraits;
    private String dreamCountries;
    
    private LocalDateTime lastLogin;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (roles.isEmpty()) {
            roles.add(Role.USER);
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public boolean isAdmin() {
        return roles.contains(Role.ADMIN);
    }
    
    public void addRole(Role role) {
        roles.add(role);
    }
    
    public void removeRole(Role role) {
        roles.remove(role);
    }
}
