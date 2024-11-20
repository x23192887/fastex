package com.nci.skeleton.repository;

import com.nci.skeleton.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByStatus(String status);

    List<Booking> findByStatusAndBookedBy(String status, String postedBy);
}
