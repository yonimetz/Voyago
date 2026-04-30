package com.voyago.server.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "route_stops")
@Data
public class RouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String locationName;
    private String address;
    private String visitTime; // שעת ביקור מתוכננת

    @ManyToOne
    @JoinColumn(name = "day_id", nullable = false)
    private TripDay tripDay;
}