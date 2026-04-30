package com.voyago.server.services;

import com.voyago.server.models.RouteStop;
import com.voyago.server.repositories.RouteStopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RouteStopService {
    @Autowired
    private RouteStopRepository routeStopRepository;

    public RouteStop saveStop(RouteStop stop) {
        return routeStopRepository.save(stop);
    }

    public List<RouteStop> getStopsByDayId(Long dayId) {
        return routeStopRepository.findByTripDayId(dayId);
    }
}