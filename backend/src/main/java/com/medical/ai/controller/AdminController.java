package com.medical.ai.controller;

import com.medical.ai.dto.ApiResponse;
import com.medical.ai.entity.User;
import com.medical.ai.repository.ChatHistoryRepository;
import com.medical.ai.repository.ImageReportRepository;
import com.medical.ai.repository.UserRepository;
import com.medical.ai.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ChatHistoryRepository chatHistoryRepository;
    private final ImageReportRepository imageReportRepository;
    private final AppointmentRepository appointmentRepository;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(u -> {
            u.setPassword(null);
            u.setChatHistories(null);
            u.setImageReports(null);
            u.setAppointments(null);
            u.setMedicalHistories(null);
        });
        return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", "User with id " + id + " deleted"));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getAnalytics() {
        Map<String, Long> analytics = new HashMap<>();
        analytics.put("totalUsers", userRepository.count());
        analytics.put("totalChats", chatHistoryRepository.count());
        analytics.put("totalImageReports", imageReportRepository.count());
        analytics.put("totalAppointments", appointmentRepository.count());
        return ResponseEntity.ok(ApiResponse.success("Analytics fetched", analytics));
    }

    @GetMapping("/chat-history")
    public ResponseEntity<ApiResponse<?>> getAllChatHistory() {
        return ResponseEntity.ok(
                ApiResponse.success("Chat history fetched",
                        chatHistoryRepository.findAll())
        );
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<?>> getAllAppointments() {
        return ResponseEntity.ok(
                ApiResponse.success("All appointments fetched",
                        appointmentRepository.findAll())
        );
    }
}
