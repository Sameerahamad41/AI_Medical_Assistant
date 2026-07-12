package com.medical.ai.controller;

import com.medical.ai.dto.ApiResponse;
import com.medical.ai.entity.User;
import com.medical.ai.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(Authentication authentication) {
        User user = authService.getProfile(authentication.getName());
        // Clear password before returning
        user.setPassword(null);
        user.setChatHistories(null);
        user.setImageReports(null);
        user.setAppointments(null);
        user.setMedicalHistories(null);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", user));
    }
}
