package com.voyago.server.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "trip_days")
@Data
public class TripDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int dayNumber; // יום 1, יום 2 וכו'
    private String description; // כותרת אופציונלית ליום (למשל: "סיור בעיר העתיקה")

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnore
    private Trip trip;

    @OneToMany(mappedBy = "tripDay", cascade = CascadeType.ALL)
    private List<RouteStop> stops;
}