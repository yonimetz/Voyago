package com.voyago.server.dto;

import lombok.Data;

@Data
public class TripGenerationRequest {
    private Long userId;
    private String destination;
    private String startDate;
    private String endDate;
    private String style;
    private String language;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    
    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}