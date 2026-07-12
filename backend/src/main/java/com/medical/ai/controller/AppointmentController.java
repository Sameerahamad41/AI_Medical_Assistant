package com.medical.ai.controller;

import com.medical.ai.dto.ApiResponse;
import com.medical.ai.dto.AppointmentRequest;
import com.medical.ai.dto.DoctorRecommendation;
import com.medical.ai.entity.Appointment;
import com.medical.ai.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping("/my-appointments")
    public ResponseEntity<ApiResponse<List<Appointment>>> getMyAppointments(Authentication authentication) {
        String email = authentication.getName();
        List<Appointment> appointments = appointmentService.getAppointmentsByUser(email);
        return ResponseEntity.ok(ApiResponse.success("Appointments fetched successfully", appointments));
    }

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<Appointment>> bookAppointment(
            @RequestBody AppointmentRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Appointment appointment = appointmentService.bookAppointment(email, request);
        return ResponseEntity.ok(ApiResponse.success("Appointment booked successfully", appointment));
    }

    @PostMapping("/recommend")
    public ResponseEntity<ApiResponse<List<DoctorRecommendation>>> recommendDoctors(
            @RequestBody Map<String, String> requestBody) {
        String symptoms = requestBody.get("symptoms");
        if (symptoms == null || symptoms.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Symptoms are required"));
        }
        
        List<DoctorRecommendation> recommendations = appointmentService.recommendDoctors(symptoms);
        return ResponseEntity.ok(ApiResponse.success("Doctors recommended successfully", recommendations));
    }
}
