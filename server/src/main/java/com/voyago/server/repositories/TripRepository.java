package com.voyago.server.repositories;

import com.voyago.server.models.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserId(Long userId); // שליפת כל הטיולים של משתמש ספציפי
}