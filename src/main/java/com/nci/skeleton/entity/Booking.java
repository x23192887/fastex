package com.nci.skeleton.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Data
@Table(name = "deliveries")
public class Booking {
    @Id
    private UUID id;
    private String fromLocation;
    private String toLocation;
    private BigDecimal price;
    private String bookingClass;
    private String pickupAddress;
    private String deliveryAddress;
    private String receiverName;
    private String estimatedDeliveryDate;
    private String status;
    private String bookedBy;
    private LocalDateTime bookedOn;
    private LocalDateTime modifiedOn;
    @Column(length = 3000)
    private List<String> images;
}
