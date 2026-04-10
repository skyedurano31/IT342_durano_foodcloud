package edu.cit.durano.foodcloud.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;

    @Column(unique = true)
    private String email;

    private String password_hash;

    @Column(unique = true)
    private String googleId;

    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_GUEST;

    public User (){}
    public User (String username,String email,String password_hash) {
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
    }

    //set get

    public void setUsername(String username) {this.username = username;}
    public void setEmail(String email) {this.email = email;}
    public void setPassword_hash(String password_hash) {this.password_hash = password_hash;}
    public void setGoogleId(String googleId) {this.googleId = googleId;}
    public void setRole(Role role) {
        this.role = role;
    }

    public String getUsername() {return username;}
    public String getEmail() {return email;}
    public String getPassword_hash() {return password_hash;}
    public String getGoogleId() {return googleId;}
    public Role getRole() {
        return role;
    }
    public Long getId() {return id;}


}