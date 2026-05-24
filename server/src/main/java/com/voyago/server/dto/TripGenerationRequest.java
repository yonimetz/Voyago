package com.voyago.server.dto;

import lombok.Data;

@Data
public class TripGenerationRequest {
    private String destination;
    private String startDate;
    private String endDate;
    private String style;
}