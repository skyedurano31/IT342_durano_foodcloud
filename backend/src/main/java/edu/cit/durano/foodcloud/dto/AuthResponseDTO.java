package edu.cit.durano.foodcloud.dto;

import edu.cit.durano.foodcloud.entity.Role;

public class AuthResponseDTO {
    private String message;
    private String username;
    private String email;
    private Role role;
    private boolean authenticated;

    public AuthResponseDTO(String message, String username, String email, Role role, boolean authenticated) {
        this.message = message;
        this.username = username;
        this.email = email;
        this.role = role;
        this.authenticated = authenticated;
    }

    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isAuthenticated() { return authenticated; }
    public void setAuthenticated(boolean authenticated) { this.authenticated = authenticated; }
}
