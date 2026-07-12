package com.medical.ai.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AppointmentRequest {
    private String doctorName;
    private String specialization;
    private LocalDate appointmentDate;
    private String appointmentTime;
    private String notes;
}
