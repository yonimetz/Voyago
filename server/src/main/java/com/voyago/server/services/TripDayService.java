package com.voyago.server.services;

import com.voyago.server.models.TripDay;
import com.voyago.server.repositories.TripDayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TripDayService {
    @Autowired
    private TripDayRepository tripDayRepository;

    public TripDay saveTripDay(TripDay day) {
        return tripDayRepository.save(day);
    }

    public List<TripDay> getDaysByTripId(Long tripId) {
        return tripDayRepository.findByTripId(tripId);
    }
}