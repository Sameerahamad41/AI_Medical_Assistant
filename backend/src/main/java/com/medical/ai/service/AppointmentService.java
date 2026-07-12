package com.medical.ai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medical.ai.ai.GroqService;
import com.medical.ai.dto.AppointmentRequest;
import com.medical.ai.dto.DoctorRecommendation;
import com.medical.ai.entity.Appointment;
import com.medical.ai.entity.User;
import com.medical.ai.repository.AppointmentRepository;
import com.medical.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    private static final String RECOMMENDATION_PROMPT = """
            You are a medical scheduling assistant. Based on the user's symptoms, you must recommend 3 specialized doctors.
            
            Return the output ONLY as a valid JSON array of objects. Do not include markdown formatting like ```json or any conversational text.
            Each object must have the following keys exactly:
            - "doctorName" : A realistic sounding fictional doctor name (e.g. "Dr. Sarah Jenkins")
            - "specialization" : The medical specialty best suited for the symptoms (e.g. "Cardiologist", "Dermatologist")
            - "reason" : A 1-sentence reason why this specialist is recommended based on the symptoms.
            
            Example output format:
            [
              {
                "doctorName": "Dr. Alan Grant",
                "specialization": "Neurologist",
                "reason": "Neurologists specialize in treating persistent headaches and migraines."
              }
            ]
            """;

    public List<Appointment> getAppointmentsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return appointmentRepository.findByUserIdOrderByAppointmentDateDesc(user.getId());
    }

    public Appointment bookAppointment(String email, AppointmentRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Appointment appointment = Appointment.builder()
                .user(user)
                .doctorName(request.getDoctorName())
                .specialization(request.getSpecialization())
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .notes(request.getNotes())
                .status(Appointment.AppointmentStatus.SCHEDULED)
                .build();

        return appointmentRepository.save(appointment);
    }

    public List<DoctorRecommendation> recommendDoctors(String symptoms) {
        String userPrompt = "My symptoms are: " + symptoms + ". Please recommend doctors.";
        String aiResponse = groqService.sendTextPrompt(RECOMMENDATION_PROMPT, userPrompt);
        
        try {
            // Clean up possible markdown if the AI disobeys instructions
            aiResponse = aiResponse.replace("```json", "").replace("```", "").trim();
            
            return objectMapper.readValue(aiResponse, new TypeReference<List<DoctorRecommendation>>() {});
        } catch (Exception e) {
            log.error("Failed to parse doctor recommendations from Groq", e);
            throw new RuntimeException("Failed to generate doctor recommendations. Please try again.");
        }
    }
}
