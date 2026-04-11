package edu.cit.durano.foodcloud.controller;

import edu.cit.durano.foodcloud.dto.AuthResponseDTO;
import edu.cit.durano.foodcloud.entity.Role;
import edu.cit.durano.foodcloud.entity.User;
import edu.cit.durano.foodcloud.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
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

    // Get current user info
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        // Check if user logged in via Google OAuth2
        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            String googleId = oauth2User.getAttribute("sub");

            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                if (user.getGoogleId() == null) {
                    user.setGoogleId(googleId);
                    userRepository.save(user);
                }
            } else {
                user = new User();
                user.setUsername(name);
                user.setEmail(email);
                user.setGoogleId(googleId);
                user.setPassword_hash("");
                user.setRole(Role.ROLE_USER);
                user = userRepository.save(user);
            }

            // ✅ ADD THE ID HERE
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),           // ← ADD THIS
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole().toString(),
                    "authProvider", "google"
            ));
        }

        // Handle regular username/password login
        if (authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            org.springframework.security.core.userdetails.User userDetails =
                    (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

            Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                // ✅ ADD THE ID HERE
                return ResponseEntity.ok(Map.of(
                        "id", user.getId(),       // ← ADD THIS
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "role", user.getRole().toString(),
                        "authProvider", "basic"
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not found"));
    }

    // Logout endpoint
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new AuthResponseDTO("Logged out successfully", null, null, null, false));
    }
}