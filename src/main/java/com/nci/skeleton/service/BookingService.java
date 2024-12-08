package com.nci.skeleton.service;

import com.google.gson.Gson;
import com.nci.skeleton.entity.Booking;
import com.nci.skeleton.model.ResponseModel;
import com.nci.skeleton.repository.BookingRepository;
import com.nci.skeleton.repository.UserRepository;
import com.nci.skeleton.security.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import static com.nci.skeleton.config.Constants.STATUS_ACTIVE;
import static com.nci.skeleton.config.Constants.STATUS_INACTIVE;
import static java.util.Objects.nonNull;

@Service
public class BookingService {

    @Autowired
    BookingRepository bookingRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    SQSService sqsService;

    @Autowired
    private JavaMailSender emailSender;

    public List<Booking> fetchMyBookings(String userId) {
        return bookingRepository.findByStatusAndBookedBy(STATUS_ACTIVE, userId);
    }

    public ResponseModel saveBooking(Booking booking, String userName) {
        ResponseModel response = new ResponseModel();
        try {
            booking.setId(UUID.randomUUID());
            booking.setDeliveryAddress(booking.getDeliveryAddress());
            booking.setFromLocation(booking.getFromLocation());
            booking.setToLocation(booking.getToLocation());
            booking.setReceiverName(booking.getReceiverName());
            booking.setPickupAddress(booking.getPickupAddress());
            booking.setEstimatedDeliveryDate(booking.getEstimatedDeliveryDate());
            booking.setStatus(STATUS_ACTIVE);
            booking.setBookedOn(LocalDateTime.now());
            booking.setBookedBy(userName);
            booking.setBookingClass(booking.getBookingClass());
            booking.setPrice(booking.getPrice());
            bookingRepository.save(booking);
            User enquiryUser = userRepository.findByUsername(userName).orElse(new User());
            sendEmail(enquiryUser, booking);
            response.setStatus("Success");
            response.setMessage("Operation Successful");
            response.setCreationId(booking.getId().toString());
        } catch (Exception e) {
            response.setException(e.getLocalizedMessage());
        }
        return response;
    }

    public ResponseModel updateBooking(UUID propertyId, Booking booking, String userName) {
        ResponseModel response = new ResponseModel();
        try {
            bookingRepository.findById(propertyId).ifPresent(
                    savedBooking -> {
                        if (savedBooking.getBookedBy().equals(userName)) {
                            setUpdatedValues(savedBooking, booking);
                            bookingRepository.save(savedBooking);
                            response.setStatus("Success");
                            response.setMessage("Operation Successful");
                        } else {
                            response.setStatus("Unsuccessful");
                            response.setMessage("Operation Unsuccessful : Not Authorized To Update This Property");
                        }
                    }
            );
        } catch (Exception e) {
            response.setStatus("Unsuccessful");
            response.setMessage("Exception Occurred");
            response.setException(e.getLocalizedMessage());
        }
        return response;
    }

    private void setUpdatedValues(Booking booking, Booking updatedProp) {
        if (nonNull(updatedProp.getBookingClass()))
            booking.setBookingClass(updatedProp.getBookingClass());
        if (nonNull(updatedProp.getPrice()))
            booking.setPrice(updatedProp.getPrice());
        booking.setModifiedOn(LocalDateTime.now());
    }

    public ResponseModel inactiveProperty(UUID bookingId, String userName) {
        ResponseModel response = new ResponseModel();
        try {
            bookingRepository.findById(bookingId).ifPresent(
                    savedBooking -> {
                        if (savedBooking.getBookedBy().equals(userName)) {
                            savedBooking.setStatus(STATUS_INACTIVE);
                            bookingRepository.save(savedBooking);
                            response.setStatus("Success");
                            response.setMessage("Operation Successful");
                        } else {
                            response.setStatus("Unsuccessful");
                            response.setMessage("Operation Unsuccessful : Not Authorized To Update This Property");
                        }
                    }
            );
        } catch (Exception e) {
            response.setStatus("Unsuccessful");
            response.setMessage("Exception Occurred");
            response.setException(e.getLocalizedMessage());
        }
        return response;
    }

    public void sendEmail(User productUser, Booking booking) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("dhanushasiva218@gmail.com");
        message.setTo(productUser.getEmail());
        message.setSubject("Congratulations! "+productUser.getFirstname()+", Your Delivery Has Been Booked...");
        message.setText("Thank you for choosing Fastex for your courier needs! We are excited to assist you in delivering your package swiftly and securely.\n" +
                "\n" +
                "Here are the details of your booking:\n" +
                "\n" +
                "Booking ID: "+booking.getId()+"\n" +
                "Pickup Address: "+booking.getId()+"\n" +
                "Delivery Address: "+booking.getId()+"\n" +
                "Package Details: "+booking.getId()+"\n" +
                "Estimated Delivery Time: "+booking.getEstimatedDeliveryDate()+"\n" +
                "Delivery Charges: "+booking.getPrice()+"\n" +
                "Our team is committed to ensuring your package reaches its destination on time. You can track your delivery status in real-time using the Fastex app or by visiting our website at [tracking link].\n" +
                "\n" +
                "If you have any questions or need assistance, please don’t hesitate to contact our support team at [support email/phone number].\n" +
                "\n" +
                "Thank you for trusting Fastex. We look forward to serving you!\n" +
                "\n" +
                "Best regards,\n" +
                "The Fastex Team");
        emailSender.send(message);
    }

}
