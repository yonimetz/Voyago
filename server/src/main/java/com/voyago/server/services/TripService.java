package com.voyago.server.services;

import com.voyago.server.models.Trip;
import com.voyago.server.repositories.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TripService {
    @Autowired
    private TripRepository tripRepository;

    public Trip saveTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    public List<Trip> getTripsByUserId(Long userId) {
        return tripRepository.findByUserId(userId);
    }

    // פונקציה לשליפת טיול בודד לפי מזהה
    public Trip getTripById(Long id) {
        return tripRepository.findById(id).orElse(null);
    }

    // פונקציה למחיקת טיול לפי ID
    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
}