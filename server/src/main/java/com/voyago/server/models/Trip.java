package com.voyago.server.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "trips")
@Data
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String destination;
    private String imageKeyword;

    private LocalDate startDate;
    private LocalDate endDate;

    // הקשר למשתמש - טיולים רבים שייכים למשתמש אחד
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private List<TripDay> days;

    public String getImageKeyword() { return imageKeyword; }
    public void setImageKeyword(String imageKeyword) { this.imageKeyword = imageKeyword; }
}