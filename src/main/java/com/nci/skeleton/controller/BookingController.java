package com.nci.skeleton.controller;

import com.nci.skeleton.entity.Booking;
import com.nci.skeleton.model.ResponseModel;
import com.nci.skeleton.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/booking")
public class BookingController {

    @Autowired
    BookingService bookingService;

    @GetMapping("/myBookings")
    public ResponseEntity<List<Booking>> getConfirmedBookings(Principal principal) {
        return new ResponseEntity<>(bookingService.fetchMyBookings(principal.getName()), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ResponseModel> bookDelivery(@RequestBody Booking booking, Principal principal) {
        return new ResponseEntity<>(bookingService.saveBooking(booking, principal.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<ResponseModel> updateBooking(@PathVariable UUID bookingId,
                                                        @RequestBody Booking booking,
                                                        Principal principal) {
        return new ResponseEntity<>(bookingService.updateBooking(bookingId, booking, principal.getName()), HttpStatus.OK);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<ResponseModel> deleteBooking(@PathVariable UUID bookingId, Principal principal) {
        return new ResponseEntity<>(bookingService.inactiveProperty(bookingId, principal.getName()), HttpStatus.OK);
    }
}
