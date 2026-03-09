package edu.cit.durano.foodcloud.controller;

import edu.cit.durano.foodcloud.dto.AuthResponseDTO;
import edu.cit.durano.foodcloud.dto.LoginRequestDTO;
import edu.cit.durano.foodcloud.entity.Role;
import edu.cit.durano.foodcloud.entity.User;
import edu.cit.durano.foodcloud.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

public class AuthRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new AuthResponseDTO("Username already exists", null, null, null, false));
            }

            // Encode the password and save to password_hash field
            user.setPassword_hash(passwordEncoder.encode(user.getPassword_hash()));
            user.setRole(Role.ROLE_USER);  // Set default role

            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(new AuthResponseDTO(
                    "User registered successfully",
                    savedUser.getUsername(),
                    savedUser.getEmail(),
                    savedUser.getRole(),
                    true
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponseDTO("Registration failed: " + e.getMessage(), null, null, null, false));
        }
    }

    // Login endpoint - with Basic Auth, Spring Security handles the actual auth
    // This endpoint just returns user info after successful authentication
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        // With Basic Auth, the actual authentication happens in the filter chain
        // This endpoint is just to return user info after successful auth
        try {
            // Spring Security will have authenticated the user before this method is called
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                User user = userRepository.findByUsername(auth.getName()).orElse(null);

                if (user != null) {
                    return ResponseEntity.ok(new AuthResponseDTO(
                            "Login successful",
                            user.getUsername(),
                            user.getEmail(),
                            user.getRole(),
                            true
                    ));
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponseDTO("Login failed", null, null, null, false));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponseDTO("Login failed: " + e.getMessage(), null, null, null, false));
        }
    }

    // Get current user info
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            User user = userRepository.findByUsername(auth.getName()).orElse(null);

            if (user != null) {
                return ResponseEntity.ok(new AuthResponseDTO(
                        "User found",
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        true
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponseDTO("Not authenticated", null, null, null, false));
    }

    // Logout endpoint
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new AuthResponseDTO("Logged out successfully", null, null, null, false));
    }
}