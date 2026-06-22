package com.voyago.server.dto;

public class UserUpdateDTO {
    private String username;
    private String email;
    private String aiPreferences;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAiPreferences() { return aiPreferences; }
    public void setAiPreferences(String aiPreferences) { this.aiPreferences = aiPreferences; }
}